import express from "express";
import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// =======================
// REGISTER
// =======================
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔒 validar email único
        const existe = await User.findOne({ email });

        if (existe) {
            return res.json({
                success: false,
                error: "El email ya está registrado"
            });
        }

        // 🔐 encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en registro" });
    }
});


// =======================
// LOGIN
// =======================
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Usuario no encontrado"
            });
        }

        // 🔐 comparar password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                success: false,
                error: "Contraseña incorrecta"
            });
        }

        // 🎟 JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            "SECRET_KEY", // después lo pasamos a .env
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            token,
            user: {
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en login" });
    }
});

export default router;