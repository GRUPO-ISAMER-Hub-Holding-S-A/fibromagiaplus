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

        if (item.cantidad + 1 > producto.stock) {

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

    if (!checkoutModal) return;

    checkoutModal.classList.add("active");

    document.body.style.overflow = "hidden";

}

function cerrarCheckout() {

    checkoutModal.classList.remove("active");

    document.body.style.overflow = "";

}


// =======================
// RESUMEN CHECKOUT
// =======================

const checkoutResumen =
    document.getElementById("checkoutResumen");

function renderResumenCheckout() {

    if (!checkoutResumen) return;

    let html = "";

    let total = 0;

    carrito.forEach(item => {

        const producto = getProducto(item.id);

        if (!producto) return;

        const subtotal =
            producto.precio * item.cantidad;

        total += subtotal;

        html += `
            <div class="checkout-item">

                <span>
                    ${producto.nombre}
                    x${item.cantidad}
                </span>

                <strong>
                    $${subtotal}
                </strong>

            </div>
        `;

    });

    html += `

        <div class="checkout-total">

            TOTAL

            <strong>

                $${total}

            </strong>

        </div>

    `;

    checkoutResumen.innerHTML = html;

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



// =======================
// CONTINUAR A MERCADO PAGO
// =======================

document
    .getElementById("continuarPago")
    ?.addEventListener("click", iniciarCheckout);


async function iniciarCheckout() {

    try {

        if (carrito.length === 0) {

            alert("El carrito está vacío");

            return;

        }

        // =====================
        // CLIENTE
        // =====================

        const cliente = {

            nombre: document.getElementById("nombre").value.trim(),

            apellido: document.getElementById("apellido").value.trim(),

            email: document.getElementById("email").value.trim(),

            telefono: document.getElementById("telefono").value.trim()

        };

        // =====================
        // ENVÍO
        // =====================

        const envio = {

            provincia: document.getElementById("provincia").value.trim(),

            ciudad: document.getElementById("ciudad").value.trim(),

            calle: document.getElementById("calle").value.trim(),

            altura: document.getElementById("altura").value.trim(),

            piso: document.getElementById("piso").value.trim(),

            departamento: document.getElementById("departamento").value.trim(),

            codigoPostal: document.getElementById("cp").value.trim(),

            referencia: document.getElementById("referencia").value.trim(),

            entreCalles: document.getElementById("entreCalles").value.trim()

        };

        // =====================
        // VALIDACIÓN
        // =====================

        if (

            !cliente.nombre ||

            !cliente.apellido ||

            !cliente.email ||

            !cliente.telefono ||

            !envio.provincia ||

            !envio.ciudad ||

            !envio.calle ||

            !envio.altura ||

            !envio.codigoPostal

        ) {

            alert("Completá todos los campos obligatorios.");

            return;

        }

        // =====================
        // ITEMS
        // =====================

        const items = carrito.map(item => {

            const producto = getProducto(item.id);

            return {

                nombre: producto.nombre,

                cantidad: item.cantidad,

                precio: producto.precio

            };

        });

        console.log("Checkout:", {

            cliente,

            envio,

            items

        });

        const res = await fetch(

            `${API_BASE_URL}/api/crear-pago`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    cliente,

                    envio,

                    items

                })

            }

        );

        const data = await res.json();

        if (!res.ok) {

            alert(data.message || "Error creando el pago");

            return;

        }

        if (!data.url) {

            alert("No llegó la URL de Mercado Pago");

            return;

        }

        window.location.href = data.url;

    }

    catch (err) {

        console.error(err);

        alert("Error iniciando el checkout.");

    }

}