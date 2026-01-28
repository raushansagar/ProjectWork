import { express, app } from './app.js';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectDB } from './database/database.js';
import router from './routes/router.js'


dotenv.config({ path: "./.env" });


// Enable CORS for your frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://productr-frontend-6j3v.onrender.com",
];


app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server & Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);



// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());



// // API routes
app.use("/productr/v2", router);


// Start server after DB connection
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error occurred while connecting to DB: ${error}`);
  });