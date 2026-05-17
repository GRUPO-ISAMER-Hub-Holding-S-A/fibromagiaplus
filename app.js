const productos = [
    { id: 1, nombre: "Faja lumbar", precio: 20000, img: "./assets/imge/fajalumbar.jpeg" },
    { id: 2, nombre: "Rodillera", precio: 12500, img: "./assets/imge/rodillera.jpg.jpeg" },
    { id: 3, nombre: "Tobillera", precio: 18000, img: "./assets/imge/tobillera.jpg.jpeg" },
    { id: 4, nombre: "Foam Roller", precio: 38000, img: "./assets/imge/foamroller.jpg.webp" },
    { id: 5, nombre: "PACK Fibromagia", precio: 89000, img: "./assets/imge/pack2.png" }
];

const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || (
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "https://fibromagiaplus-backend.onrender.com"
);
window.API_BASE_URL = API_BASE_URL;

//Contador de visitas (simple, sin backend)
function actualizarLive() {
    const numero = Math.floor(Math.random() * 30) + 40;
    document.querySelector(".live-bar").innerText =
        `🔥 +${numero} personas están viendo este producto ahora`;
}

setInterval(actualizarLive, 4000);
actualizarLive();


// 2. ESTADO (LIMPIO)

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// NORMALIZAR 
carrito = carrito.map(p => ({
    id: p.id,
    cantidad: Number(p.cantidad) || 1
}));


// 3. SELECTORES

const cartDrawer = document.getElementById("cartDrawer");


// 4. FUNCIONES CORE


function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
    actualizarContador();
}

// obtener producto SIEMPRE actualizado
function getProducto(id) {
    return productos.find(p => p.id === id);
}

// agregar
function agregarAlCarrito(id) {
    const existe = carrito.find(p => p.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ id, cantidad: 1 });
    }

    guardarCarrito();

    // 🔥 animación tipo Shopify
    const icon = document.getElementById("cartIcon");
    icon.classList.add("shake");

    setTimeout(() => {
        icon.classList.remove("shake");
    }, 300);
}

// sumar
function sumarCantidad(id) {
    const item = carrito.find(p => p.id === id);
    item.cantidad++;
    guardarCarrito();
}

// restar
function restarCantidad(id) {
    const item = carrito.find(p => p.id === id);

    if (item.cantidad > 1) {
        item.cantidad--;
    } else {
        carrito = carrito.filter(p => p.id !== id);
    }

    guardarCarrito();
}

// eliminar
function eliminarProducto(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
}

// abrir/cerrar
function abrirCarrito() {
    cartDrawer.classList.add("open");
}

function cerrarCarrito() {
    cartDrawer.classList.remove("open");
}


// 5. RENDER


function renderCarrito() {
    const container = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");

    if (!container || !totalEl) return;

    container.innerHTML = "";

    let total = 0;

    carrito.forEach(item => {
        const producto = getProducto(item.id);

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${producto.img}">
                <div>
                    <p>${producto.nombre}</p>
                    <p>$${producto.precio}</p>

                    <div class="qty">
                        <button onclick="restarCantidad(${item.id})">➖</button>
                        <span>${item.cantidad}</span>
                        <button onclick="sumarCantidad(${item.id})">➕</button>
                    </div>

                    <button onclick="eliminarProducto(${item.id})">🗑 Eliminar</button>
                </div>
            </div>
        `;
    });

    totalEl.innerText = `Total: $${total}`;
}

// contador
function actualizarContador() {
    const contador = document.getElementById("cartCount");
    if (!contador) return;

    const total = carrito.reduce((acc, p) => acc + (Number(p.cantidad) || 0), 0);
    contador.innerText = total;
}


// 6. EVENTOS


// icono
document.getElementById("cartIcon")?.addEventListener("click", abrirCarrito);

// botones principales
document.getElementById("buyBtn")?.addEventListener("click", () => {
    agregarAlCarrito(1);
    abrirCarrito();
});

document.getElementById("buyBtn2")?.addEventListener("click", abrirCarrito);

// cerrar
document.getElementById("closeCart")?.addEventListener("click", cerrarCarrito);

// productos
document.querySelectorAll(".producto").forEach(el => {
    const id = parseInt(el.dataset.id);

    el.querySelector(".btn-add")?.addEventListener("click", () => {
        agregarAlCarrito(id);
    });
});

// 🔥 PACK 
document.getElementById("packBtn")?.addEventListener("click", () => {
    agregarAlCarrito(5);
    abrirCarrito();
});


// 7. CHECKOUT PRO


document.getElementById("checkoutBtn")?.addEventListener("click", async () => {

    const user = localStorage.getItem("user");

    if (!user) {
        localStorage.setItem("redirectAfterLogin", "checkout");
        window.location.href = "auth.html";
        return;
    }

    try {
        if (carrito.length === 0) {
            alert("Tu carrito esta vacio");
            return;
        }

        // 🔹 armamos items desde carrito
        const items = carrito.map(item => {
            const p = getProducto(item.id);

            return {
                nombre: p.nombre,
                cantidad: Number(item.cantidad),
                precio: Number(p.precio)
            };
        });

        console.log("ENVIANDO A MP:", items);

        // 🔹 llamada al backend
        const res = await fetch(`${API_BASE_URL}/api/crear-pago`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items })
        });

        const data = await res.json();

        console.log("RESPUESTA MP:", data);

        if (!res.ok) {
            alert(data.message || "Error creando el pago");
            return;
        }

        if (!data.url) {
            alert("Error creando el pago");
            return;
        }

        // 🔥 REDIRECCIÓN A MERCADOPAGO
        window.location.href = data.url;

    } catch (error) {
        console.error("ERROR CHECKOUT:", error);
        alert("Error iniciando pago");
    }
});

//cerrar sesion

function renderUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    const container = document.getElementById("userInfo");

    if (!container) return;

    if (user) {
        container.innerHTML = `
            👤 ${user.email}
            <button onclick="logout()">Salir</button>
        `;
    } else {
        container.innerHTML = `
            <a href="auth.html">Iniciar sesión</a>
        `;
    }
}

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    location.reload();
}

renderUser();


// 8. INIT

renderCarrito();
actualizarContador();
