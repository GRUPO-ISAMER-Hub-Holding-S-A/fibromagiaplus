import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/users.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {

    try {

        const name = String(req.body.name || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const { password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Completar todos los campos"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Ese email ya existe"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.json({
            success: true,
            message: "Cuenta creada correctamente"
        });

    } catch (error) {

        console.log(error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Ese email ya existe"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error en servidor"
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {

    try {

        const email = String(req.body.email || "").trim().toLowerCase();
        const { password } = req.body;

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Falta configurar JWT_SECRET"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {

            return res.status(400).json({
                success: false,
                message: "Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        res.json({
            success: true,
            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error login"
        });
    }
});

export default router;
