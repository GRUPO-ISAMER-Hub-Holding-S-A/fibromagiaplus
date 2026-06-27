const redirect = localStorage.getItem("redirectAfterLogin");
const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || (
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "https://fibromagiaplus.onrender.com"
);
window.API_BASE_URL = API_BASE_URL;

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const titulo = document.getElementById("tituloAuth");
const switchText = document.getElementById("switchText");


// VISTA INICIAL

if (redirect === "checkout") {
    titulo.innerText = "Crear cuenta para finalizar compra";
    registerForm.style.display = "block";
    loginForm.style.display = "none";
} else {
    titulo.innerText = "Iniciar sesión";
    loginForm.style.display = "block";
    registerForm.style.display = "none";
}

updateSwitch();


// SWITCH UX

function updateSwitch() {
    if (loginForm.style.display === "none") {
        switchText.innerHTML = `¿Ya tenés cuenta? <span onclick="toggleAuth()" style="color:blue;cursor:pointer;">Iniciar sesión</span>`;
    } else {
        switchText.innerHTML = `¿No tenés cuenta? <span onclick="toggleAuth()" style="color:blue;cursor:pointer;">Registrarse</span>`;
    }
}

function toggleAuth() {
    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
    updateSwitch();
}


// LOGIN

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        console.log("LOGIN RESPONSE:", data); // 👈 DEBUG

        if (!data.success) {
            alert(data.message || data.error || "Error al iniciar sesión");
            return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        redirigir();

    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor");
    }
});

// =======================
// REGISTER + AUTO LOGIN
// =======================
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const res = await fetch(`${API_BASE_URL}/api/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.message || data.error || "Error al registrarse");
            return;
        }

        // AUTO LOGIN
        const loginRes = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });

        const loginData = await loginRes.json();

        if (!loginData.success) {
            alert(loginData.message || loginData.error || "Cuenta creada, pero no se pudo iniciar sesión");
            return;
        }

        localStorage.setItem("user", JSON.stringify(loginData.user));
        localStorage.setItem("token", loginData.token);

        redirigir();
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor");
    }
});

// =======================
// REDIRECCIÓN
// =======================
function redirigir() {
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = "index.html";
}
