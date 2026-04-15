const redirect = localStorage.getItem("redirectAfterLogin");

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
        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        console.log("LOGIN RESPONSE:", data); // 👈 DEBUG

        if (!data.success) {
            alert(data.error || "Error al iniciar sesión");
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

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.success) {
        alert(data.error);
        return;
    }

    // AUTO LOGIN
    const loginRes = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const loginData = await loginRes.json();

    localStorage.setItem("user", JSON.stringify(loginData.user));
    localStorage.setItem("token", loginData.token);

    redirigir();
});

// =======================
// REDIRECCIÓN
// =======================
function redirigir() {
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = "index.html";
}