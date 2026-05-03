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
POST /api/create-preference
```

Genera link de pago dinámico.

---

# 🤖 Automatización con n8n

## Flujo:

```text
MercadoPago → Webhook → Validación → Email → (DB opcional)
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

---

# ⚠️ Problemas comunes

### ❌ `document is not defined`

→ Estás ejecutando frontend en Node

---

### ❌ Error SMTP

→ Verificar credenciales Gmail (usar App Password)

---

### ❌ MercadoPago no responde

→ Revisar Access Token

---

### ❌ Webhook no funciona

→ Usar ngrok o servidor online

---

# 🔥 Próximas mejoras

* Panel admin
* Dashboard de ventas
* Recuperación de carrito abandonado
* Integración WhatsApp API
* Multi-producto dinámico (DB)
* Deploy en Vercel + Railway

---

# 💸 Estado del proyecto

✔ MVP funcional
✔ Escalable a ecommerce real
✔ Preparado para automatización

---

# 👩‍💻 Autor

Proyecto desarrollado como práctica avanzada de Full Stack + automatización.

---

# 🚀 Resultado

Sistema completo tipo Shopify:

✔ Landing optimizada
✔ Carrito dinámico
✔ Login real
✔ Pago integrado
✔ Automatización completa

---
