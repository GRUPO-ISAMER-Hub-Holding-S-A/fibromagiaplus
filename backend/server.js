import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(helmet());


const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5501",
    "http://127.0.0.1:5501",
    "https://lumbarfix.vercel.app",
    "https://fibromagiaplus.vercel.app",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origen no permitido por CORS"));
    }
}));
app.use(express.json());
app.use(express.static(rootDir));

connectDB();

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API funcionando"
    });
});

app.use("/api", orderRoutes);
app.use("/api", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", paymentRoutes);
app.use("/api", productRoutes);



app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
