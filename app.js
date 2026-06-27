let productos = [];

let carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];

const API_BASE_URL =
    window.APP_CONFIG?.API_BASE_URL ||
    (
        window.location.hostname === "localhost"
            ? "http://localhost:3000"
            : "https://fibromagiaplus.onrender.com"
    );

const cartDrawer =
    document.getElementById("cartDrawer");


// =======================
// PRODUCTOS
// =======================

async function cargarProductos() {

    try {

        const res = await fetch(
            `${API_BASE_URL}/api/products`
        );

        const data = await res.json();

        if (!data.success) return;

        productos = data.products.map(p => ({
            id: String(p._id),
            nombre: p.nombre,
            precio: Number(p.precio),
            stock: Number(p.stock),
            img: p.img
        }));

        console.log("PRODUCTOS:", productos);

        renderProductos();

    } catch (error) {

        console.error(error);
    }
}

function renderProductos() {

    const container =
        document.getElementById("productosContainer");

    if (!container) return;

    container.innerHTML = "";

    productos
        .filter(
            producto =>
                !producto.nombre
                    .toLowerCase()
                    .includes("pack")
        )
        .forEach(producto => {

            container.innerHTML += `
        <div class="producto">

            <img
                src="${producto.img}"
                alt="${producto.nombre}"
            >

            <h3>${producto.nombre}</h3>

            <p>$${producto.precio}</p>

            <p>Stock: ${producto.stock}</p>

            <button
                class="btn-add"
                onclick="agregarAlCarrito('${producto.id}')"
            >
                Agregar al carrito
            </button>

        </div>
        `;
        });
}


// =======================
// CARRITO
// =======================

function getProducto(id) {

    return productos.find(
        p => String(p.id) === String(id)
    );
}

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    renderCarrito();
    actualizarContador();
}

function agregarAlCarrito(id) {

    const producto = getProducto(id);

    if (!producto) {

        alert("Producto no encontrado");

        return;
    }

    const item = carrito.find(
        p => String(p.id) === String(id)
    );

    if (item) {

        if (item.cantidad >= producto.stock) {

            alert("Stock máximo alcanzado");
            return;
        }

        item.cantidad++;

    } else {

        carrito.push({
            id: String(id),
            cantidad: 1
        });
    }

    guardarCarrito();

    abrirCarrito();
}

function sumarCantidad(id) {

    const item = carrito.find(
        p => String(p.id) === String(id)
    );

    const producto = getProducto(id);

    if (!item || !producto) return;

    if (item.cantidad >= producto.stock) {

        alert("Stock máximo alcanzado");
        return;
    }

    item.cantidad++;

    guardarCarrito();
}

function restarCantidad(id) {

    const item = carrito.find(
        p => String(p.id) === String(id)
    );

    if (!item) return;

    if (item.cantidad > 1) {

        item.cantidad--;

    } else {

        carrito = carrito.filter(
            p => String(p.id) !== String(id)
        );
    }

    guardarCarrito();
}

function eliminarProducto(id) {

    carrito = carrito.filter(
        p => String(p.id) !== String(id)
    );

    guardarCarrito();
}

function vaciarCarrito() {

    carrito = [];

    guardarCarrito();
}

function renderCarrito() {

    const container =
        document.getElementById("cartItems");

    const totalEl =
        document.getElementById("cartTotal");

    if (!container) return;

    container.innerHTML = "";

    let total = 0;

    carrito.forEach(item => {

        const producto =
            getProducto(item.id);

        if (!producto) return;

        total +=
            producto.precio *
            item.cantidad;

        container.innerHTML += `
<div class="cart-item">

    <img src="${producto.img}">

    <div class="cart-info">

        <h4>${producto.nombre}</h4>

        <div class="cart-price">
            $${producto.precio}
        </div>

        <div class="qty">

            <button onclick="restarCantidad('${item.id}')">
                -
            </button>

            <span>${item.cantidad}</span>

            <button onclick="sumarCantidad('${item.id}')">
                +
            </button>

        </div>

        <button
            class="delete-btn"
            onclick="eliminarProducto('${item.id}')"
        >
            Eliminar
        </button>

    </div>

</div>
`;
    });

    if (totalEl) {

        totalEl.innerText =
            `Total: $${total}`;
    }
}

function actualizarContador() {

    const contador =
        document.getElementById("cartCount");

    if (!contador) return;

    contador.innerText =
        carrito.reduce(
            (acc, item) =>
                acc + item.cantidad,
            0
        );
}


// =======================
// DRAWER
// =======================

function abrirCarrito() {

    cartDrawer?.classList.add("open");
}


// =======================
// CHECKOUT MODAL
// =======================

const checkoutModal = document.getElementById("checkoutModal");

function abrirCheckout() {

    renderResumenCheckout();

    checkoutModal.classList.add("active");

    document.body.style.overflow = "hidden";

}

function cerrarCheckout() {

    checkoutModal.classList.remove("active");

    document.body.style.overflow = "";

}


document
    .getElementById("closeCheckout")
    ?.addEventListener(
        "click",
        cerrarCheckout
    );

checkoutModal?.addEventListener(
    "click",
    (e) => {

        if (e.target === checkoutModal) {

            cerrarCheckout();

        }

    }
);





function cerrarCarrito() {

    cartDrawer?.classList.remove("open");
}


// =======================
// EVENTOS
// =======================

document
    .getElementById("cartIcon")
    ?.addEventListener(
        "click",
        abrirCarrito
    );

document
    .getElementById("closeCart")
    ?.addEventListener(
        "click",
        cerrarCarrito
    );

document
    .getElementById("clearCartBtn")
    ?.addEventListener(
        "click",
        vaciarCarrito
    );




// =======================
// INIT
// =======================

window.addEventListener(
    "DOMContentLoaded",
    async () => {

        await cargarProductos();

        renderCarrito();

        actualizarContador();

        // BOTON HERO
        document
            .getElementById("buyBtn")
            ?.addEventListener(
                "click",
                () => {

                    const faja = productos.find(
                        p =>
                            p.nombre
                                .toLowerCase()
                                .includes("faja")
                    );

                    if (!faja) {
                        alert("Producto no encontrado");
                        return;
                    }

                    agregarAlCarrito(faja.id);

                    abrirCarrito();
                }
            );

            
        // BOTON PACK
        document
            .getElementById("packBtn")
            ?.addEventListener(
                "click",
                () => {

                    const pack = productos.find(
                        p =>
                            p.nombre
                                .toLowerCase()
                                .includes("pack")
                    );

                    if (!pack) {
                        alert("Pack no encontrado");
                        return;
                    }

                    agregarAlCarrito(pack.id);

                    abrirCarrito();
                }
            );


        // BOTON FINALIZAR COMPRA

        document
            .getElementById("checkoutBtn")
            ?.addEventListener("click", () => {

                if (carrito.length === 0) {

                    alert("Tu carrito está vacío");

                    return;

                }

                cerrarCarrito();

                abrirCheckout();

            });



    }
);


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
            <a href="login.html">Iniciar sesión</a>
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
renderUser();
renderCarrito();
actualizarContador();

