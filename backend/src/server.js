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
const fs = require("fs");

dotenv.config();
console.log(process.env.MONGODB_URI);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    useTempFiles: false,
    abortOnLimit: true,
    debug: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Configuration CORS détaillée
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  })
);

// Route de test pour vérifier l'accès aux fichiers
app.get("/api/check-file/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.json({ exists: true, path: filePath });
  } else {
    res.json({ exists: false, path: filePath });
  }
});

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security headers
app.use(helmet());

// Ajoutez ce middleware de logging pour déboguer les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Middleware de logging pour les requêtes de fichiers
app.use("/uploads", (req, res, next) => {
  console.log("File request:", {
    url: req.url,
    method: req.method,
    headers: req.headers,
    path: path.join(__dirname, "../uploads", req.url),
  });
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
