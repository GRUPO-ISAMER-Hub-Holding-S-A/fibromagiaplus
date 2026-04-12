import express from "express";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

const router = express.Router();

router.post("/crear-orden", async (req, res) => {

    try {
        const { items, total, email } = req.body;

        if (!items || !total || !email) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        const ticketId = Math.floor(Math.random() * 1000000);
        const fecha = new Date().toLocaleString();

        // ======================
        // GENERAR PDF
        // ======================
        const doc = new PDFDocument();
        let buffers = [];

        doc.on("data", (chunk) => buffers.push(chunk));

        doc.on("end", async () => {
            const pdfData = Buffer.concat(buffers);

            try {
                // ======================
                // MAIL
                // ======================
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const html = `
                    <h2>🧾 Ticket de compra</h2>
                    <p><b>Empresa:</b> Sistema Lumbar 360</p>
                    <p><b>Ticket:</b> ${ticketId}</p>
                    <p><b>Fecha:</b> ${fecha}</p>
                    <hr>
                    ${items.map(i => `
                        <p>${i.nombre} x${i.cantidad} - $${i.precio}</p>
                    `).join("")}
                    <hr>
                    <h3>Total: $${total}</h3>
                    <p>Gracias por tu compra 💙</p>
                `;

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Compra realizada ✔️",
                    html: html,
                    attachments: [
                        {
                            filename: "ticket.pdf",
                            content: pdfData
                        }
                    ]
                });

                console.log("✅ Mail enviado correctamente");

                return res.json({ success: true });

            } catch (error) {
                console.error("❌ Error enviando mail:", error);
                return res.status(500).json({ error: "Error enviando mail" });
            }
        });

        // ======================
        // CONTENIDO DEL PDF
        // ======================
        doc.fontSize(20).text("TICKET DE COMPRA", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Empresa: Sistema Lumbar 360`);
        doc.text(`Ticket: ${ticketId}`);
        doc.text(`Fecha: ${fecha}`);
        doc.moveDown();

        items.forEach(i => {
            doc.text(`${i.nombre} x${i.cantidad} - $${i.precio}`);
        });

        doc.moveDown();
        doc.fontSize(14).text(`TOTAL: $${total}`);

        doc.moveDown();
        doc.text("Gracias por su compra");

        doc.end();

    } catch (error) {
        console.error("❌ Error general:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});


router.post("/webhook", async (req, res) => {

    console.log("🔥 WEBHOOK MP:", req.body);

    // acá después vamos a validar pago real
    // por ahora solo confirmamos

    res.sendStatus(200);
});


export default router;