import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js"
import employeeRoutes from "./routes/employee.routes.js"
import visitorRoutes from "./routes/visitor.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reportRoutes from "./routes/report.routes.js";
import activityLogRoutes from "./routes/activityLog.routes.js";

const app = express();

// Define allowed origins
const allowedOrigins = [
  'https://visitor-pass-management-system-gold.vercel.app', // Replace with your exact Vercel frontend URL
  'http://localhost:5173',               // Vite dev server default
  'http://localhost:3000'                // CRA / Next.js dev server default
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Access denied for this origin.'));
    }
  },
  credentials: true, // Enable if sending cookies, authorization headers, or sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(express.urlencoded({extended : true}));

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.get("/", (req,res)=> {
    res.json({
        success : true,
        message : "Visitor Pass Management API"
    })
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/activity-logs", activityLogRoutes);

export default app;
