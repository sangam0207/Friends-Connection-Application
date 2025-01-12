import mongoose from "mongoose";
import { ENV } from "./constant.js";

mongoose
  .connect(ENV.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }) 
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
