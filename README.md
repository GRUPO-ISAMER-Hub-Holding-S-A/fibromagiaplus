# 🛒 Landing Ecommerce + Automatización (Full Stack)

Proyecto de e-commerce tipo landing optimizado para conversión, con carrito dinámico, autenticación de usuarios, integración de pagos y automatización con n8n.

---

# 🚀 Tecnologías utilizadas

## 🖥 Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)
* LocalStorage (persistencia de carrito)

## ⚙️ Backend

* Node.js
* Express
* MongoDB + Mongoose
* JWT (autenticación)
* bcrypt (encriptación)
* Nodemailer (emails)

## 💳 Pagos

* MercadoPago Checkout Pro

## 🤖 Automatización

* n8n (webhooks + emails + procesos)

---

# 🎯 Funcionalidades principales

✔ Landing page optimizada para ventas
✔ Carrito tipo Shopify (drawer lateral)
✔ Agregar / quitar productos
✔ Modificar cantidades
✔ Persistencia en localStorage
✔ Registro y login de usuarios
✔ Protección de checkout (requiere login)
✔ Integración con MercadoPago
✔ Envío de email post compra
✔ Generación de ticket
✔ Automatización con n8n
✔ Webhook de confirmación de pago
✔ Escalable a múltiples productos

---

# 📁 Estructura del proyecto

```bash
Landing ecommerce/
│
├── index.html
├── styles.css
├── app.js
│
├── assets/
│   └── images/
│
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── user.js
│   │   └── order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│
├── .env
├── package.json
```

---

# ⚙️ Instalación

## 1. Clonar el proyecto

```bash
git clone TU_REPO
cd Landing ecommerce
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Configurar variables de entorno (.env)

```env
PORT=3000

MONGO_URI=TU_URI_MONGODB

JWT_SECRET=SUPER_SECRET_KEY

EMAIL_USER=TU_EMAIL@gmail.com
EMAIL_PASS=TU_APP_PASSWORD

MP_ACCESS_TOKEN=TEST-XXXXXXXXXXXX
```

---

# ▶️ Ejecución

```bash
npm run dev
```

Servidor corriendo en:

```bash
http://localhost:3000
```

---

# 🔐 Autenticación

## Registro

```http
POST /api/auth/register
```

## Login

```http
POST /api/auth/login
```

✔ Password encriptada con bcrypt
✔ Sesión con JWT
✔ Usuario guardado en MongoDB

---

# 🛒 Carrito

* Manejado en frontend
* Persistente con localStorage
* Estructura:

```js
[
  { id: 1, cantidad: 2 },
  { id: 3, cantidad: 1 }
]
```

---

# 💳 Flujo de compra

1. Usuario agrega productos
2. Hace click en **Finalizar compra**
3. Si no está logueado → login/register
4. Se crea preferencia en MercadoPago
5. Usuario paga
6. MercadoPago envía webhook
7. n8n procesa evento
8. Se envía email + ticket

---

# 🔗 Integración MercadoPago

## Backend

```js



---

# 🤖 Automatización con n8n

## Flujo:

```text
```

### Nodo principal:

* Webhook (mp-webhook)
* HTTP Request (consulta pago)
* IF (approved)
* Set (formateo)
* Email (envío)

---

# 📧 Email

✔ Enviado automáticamente después del pago
✔ Incluye:

* Productos
* Total
* Fecha
* Cliente

---

# 🧾 Ticket de compra

* Generado dinámicamente
* Puede extenderse a PDF
* Enviado por email

---

# 🔒 Seguridad

✔ Contraseñas encriptadas
✔ JWT para sesión
✔ Validación de usuario
✔ Email único
✔ Backend separado del frontend


# 👩‍💻 Autor

Proyecto desarrollado por Belen Villar Junqueira desarrolladora Full Stack + automatización.


