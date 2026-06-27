import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, UploadCloud } from "lucide-react";
import { uploadLeadsCSV } from "../services/csv.service";
import { sendTestEmail } from "../services/email.service";
import { isEmail, required } from "../utils/validation";

export default function Tools() {
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [to, setTo] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sending, setSending] = useState(false);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setUploadError("Select a CSV file first");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadError("Only .csv files are allowed");
      return;
    }

    setUploadError("");
    setUploading(true);
    try {
      const result = await uploadLeadsCSV(file);
      toast.success(`${result.total || 0} leads imported`);
      setFile(null);
      event.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "CSV upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleEmail = async (event) => {
    event.preventDefault();
    if (!required(to)) {
      setEmailError("Recipient email is required");
      return;
    }
    if (!isEmail(to)) {
      setEmailError("Enter a valid email address");
      return;
    }

    setEmailError("");
    setSending(true);
    try {
      const result = await sendTestEmail(to);
      toast.success(result.message || "Email sent");
      setTo("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Email failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">CSV & Email</h2>
        <p className="mt-1 text-sm text-slate-500">Import leads from CSV and verify email delivery.</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <form className="rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleUpload}>
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-teal-50 text-teal-700">
              <UploadCloud size={21} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-950">Upload Leads CSV</h3>
              <p className="text-sm text-slate-500">Columns expected: name, email, phone, company.</p>
            </div>
          </div>
          <input
            accept=".csv,text/csv"
            className="block w-full rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setUploadError("");
            }}
            type="file"
          />
          {uploadError && <span className="error-text mt-2">{uploadError}</span>}
          <button className="btn-primary mt-5" disabled={uploading} type="submit">
            <UploadCloud size={17} />
            {uploading ? "Uploading..." : "Upload CSV"}
          </button>
        </form>

        <form className="rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleEmail}>
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-amber-50 text-amber-700">
              <Mail size={21} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-950">Send Test Email</h3>
              <p className="text-sm text-slate-500">Uses your backend Nodemailer endpoint.</p>
            </div>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Recipient email</span>
            <input
              className={`field ${emailError ? "field-error" : ""}`}
              onChange={(event) => {
                setTo(event.target.value);
                setEmailError("");
              }}
              type="email"
              value={to}
            />
            {emailError && <span className="error-text">{emailError}</span>}
          </label>
          <button className="btn-primary mt-5" disabled={sending} type="submit">
            <Mail size={17} />
            {sending ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
