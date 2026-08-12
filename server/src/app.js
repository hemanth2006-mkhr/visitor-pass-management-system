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

app.use(cors());

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
