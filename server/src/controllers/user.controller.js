import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUserRecord = async ({ name, email, password, role }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "SALES" } = req.body;

    if (req.user.role === "MANAGER" && role !== "SALES") {
      return res.status(403).json({ message: "Managers can create SALES users only" });
    }

    const user = await createUserRecord({ name, email, password, role });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Server Error",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const role = req.query.role ? String(req.query.role).toUpperCase() : "";
    const all = req.query.all === "true";
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const where = {
      ...(req.user.role === "MANAGER" ? { role: "SALES" } : {}),
      ...(role ? { role } : {}),
    };
    const select = {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          assignedLeads: true,
        },
      },
    };

    if (all) {
      const users = await prisma.user.findMany({
        where,
        orderBy: { name: "asc" },
        select,
      });

      return res.json({
        data: users.map(({ _count, ...user }) => ({
          ...user,
          assignedLeadCount: _count.assignedLeads,
        })),
        pagination: {
          page: 1,
          limit: users.length,
          total: users.length,
          totalPages: 1,
        },
      });
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      data: users.map(({ _count, ...user }) => ({
        ...user,
        assignedLeadCount: _count.assignedLeads,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    await prisma.lead.updateMany({
      where: { assignedToId: id },
      data: { assignedToId: null },
    });

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// -----------Login User--------------------------


// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1. user check
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 2. password check
//     const isValid = await bcrypt.compare(password, user.password);

//     if (!isValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // 3. token create
//     const token = jwt.sign(
//       { id: user.id, name: user.name, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error" });
//   }
// };


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login Request:", { email });

    // Check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log("User Found:", user.email);

    // Check password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.log("Password Matched");

    // Create token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("========== LOGIN ERROR ==========");
    console.error(err);
    console.error("Error Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("=================================");

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
