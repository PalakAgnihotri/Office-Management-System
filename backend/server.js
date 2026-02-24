const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const courierRoutes = require("./routes/courierRoutes");
const userRoutes = require("./routes/userRoutes");
const notesRoutes = require("./routes/notesRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const chequeRoutes = require("./routes/chequeRoutes");
const employeeRoutes=require("./routes/employeeRoutes");
const developmentRoutes = require("./routes/developmentRoutes");

const app = express();

app.use(cors({origin:"*"}));
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/courier", courierRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/cheques", chequeRoutes);
app.use("/api/employees",employeeRoutes);
app.use("/api/development", developmentRoutes);
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;
// Serve frontend static files
<<<<<<< HEAD
 app.use(express.static(path.join(__dirname, "../frontend/build")));
=======
app.use(express.static(path.join(__dirname, "../frontend/build")));
>>>>>>> 93a4e9b (changes don)

// // Catch-all route (for React Router)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
<<<<<<< HEAD
 });
=======
});
>>>>>>> 93a4e9b (changes don)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
