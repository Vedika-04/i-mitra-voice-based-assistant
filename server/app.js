import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connection } from "./db/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import complaintRouter from "./routes/complaintRoutes.js";
import { removeUnverifiedAccounts } from "./automation/removeUnverifiedAccounts.js";
import { autoEscalateComplaints } from "./automation/autoEscalateComplaints.js";
import superadminRouter from "./routes/adminAuth.routes.js";
import adminComplaintRouter from "./routes/adminComplaint.routes.js";
import chatRoutes from "./routes/chatRoutes.js";

//departmental
import departmentAuthRouter from "./routes/departmentAuth.routes.js";
import departmentComplaintsRouter from "./routes/departmentComplaints.routes.js";
import departmentMitraRouter from "./routes/departmentMitra.routes.js";

//Mita
import mitraAuthRouter from "./routes/mitraAuth.routes.js";
import mitraRoutes from "./routes/mitra.routes.js";

//311complaint
import complaint311Routes from "./routes/complaintRoutes311.js";
import birthCertificateRoutes from "./routes/birthCertificateRoutes.js";

export const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`<h1>Hello Umesh is live at server port 4000 <h1/>`);
});

app.use("/api/v1/user", userRouter); //http://localhost:4000/api/vi/user
app.use("/api/v1/complaint", complaintRouter);
app.use("/api/chat", chatRoutes);

//Departmental
app.use("/api/v1/department/auth", departmentAuthRouter);
app.use("/api/v1/department/complaints", departmentComplaintsRouter);
app.use("/api/v1/department/mitra", departmentMitraRouter);

//mitra
app.use("/api/v1/mitra/auth", mitraAuthRouter);
app.use("/api/v1/mitra", mitraRoutes);

//superadmin
app.use("/api/v1/superadmin/auth", superadminRouter);
app.use("/api/v1/superadmin", adminComplaintRouter);

//311complaint
app.use("/api/v1/complaint311", complaint311Routes);

import dhwaniRoutes from "./routes/dhwani.routes.js";

// Add this with your other routes
app.use("/api/v1/dhwani", dhwaniRoutes);

removeUnverifiedAccounts();
autoEscalateComplaints();
connection();
app.use("/api/v1/birth-certificates", birthCertificateRoutes);
app.use(errorMiddleware);
