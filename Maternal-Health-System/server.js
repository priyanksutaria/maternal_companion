import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { i18nMiddleware } from "./config/i18n.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import registrationRoutes from "./routes/registration.js";
import ancRoutes from "./routes/anc.js";
import reportRoutes from "./routes/report.js";
/* import lookupRoutes from "./routes/lookup.js";
 */
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nMiddleware);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/registration", registrationRoutes);
app.use("/anc", ancRoutes);
app.use("/report", reportRoutes);
/* app.use("/lookup", lookupRoutes); */

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Maternal Health System API",
    version: "1.0.0",
    description: "API documentation for Maternal Health System",
  },
  servers: [
    {
      url: "http://localhost:" + (process.env.PORT || 3000),
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;

const connectAndStart = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectAndStart();
