import "./config/dotenv.js"
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
// import cloudinary from "./config/cloudinary.js";

const PORT = process.env.PORT || 5001;

connectDB();

const server = http.createServer(app);

server.listen(PORT, async() => {
  logger.success(`Server is running on port ${PORT}`);
  // try {
  //   const res = await cloudinary.api.ping();
  //   console.log("Cloudinary api is working ", res);
  // } catch (error) {
  //   console.error("Error in connecting cloudinary api", error);
  // }
});
