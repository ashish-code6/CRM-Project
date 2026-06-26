import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import testRoutes from "./routes/test.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import csvRoutes from "./routes/csv.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import emailRoutes from "./routes/email.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/test", testRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/csv", csvRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/email", emailRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CRM API is running 🚀" });
});

export default app;