const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const errorHandler = require("./middlewares/error");

// Load env vars
dotenv.config();
console.log(process.env.MONGODB_URI);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// File upload
app.use(fileUpload());

// Set static folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security headers
app.use(helmet());

// Configuration CORS plus détaillée
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Ajoutez ce middleware de logging pour déboguer les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Welcome route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API EcoDrive" });
});

// Mount routers
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/rides", require("./routes/rides"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/reviews", require("./routes/reviews"));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`
  );
});
