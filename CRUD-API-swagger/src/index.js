import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerSpec from "./config/swagger.js";
import pool from "./config/db.js";

import errorHandler from "./middleware/errorHandler.js";
import createUserTable from "./data/createUserTable.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", userRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Create table before starting server
createUserTable();

// Testing POSTGRES connection
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database()");
    res.send(`The database name: ${result.rows[0].current_database}`);
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).send("Database connection error");
  }
});

// Server Running
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger is running on http://localhost:${port}/api-docs`);
});

// Set up Swagger documentation
swaggerSpec(app);
