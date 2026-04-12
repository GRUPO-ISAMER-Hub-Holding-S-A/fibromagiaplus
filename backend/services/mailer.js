import nodemailer from "nodemailer";

export const enviarMail = async (order) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let itemsHTML = "";

    order.items.forEach(p => {
        itemsHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.cantidad}</td>
                <td>$${p.precio}</td>
            </tr>
        `;
    });

    const html = `
        <h2>🛒 ${process.env.EMPRESA}</h2>
        <p>Gracias por tu compra 🙌</p>

        <p><strong>Ticket N°:</strong> ${order.numero}</p>
        <p><strong>Fecha:</strong> ${new Date(order.fecha).toLocaleString()}</p>

        <table border="1" cellpadding="5">
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
            </tr>
            ${itemsHTML}
        </table>

        <h3>Total: $${order.total}</h3>

        <p>Gracias por confiar en nosotros 💙</p>
    `;

    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: order.email,
        subject: "🧾 Tu compra fue confirmada",
        html
    });
};