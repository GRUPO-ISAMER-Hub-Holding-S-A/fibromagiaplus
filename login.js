const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || (
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "https://fibromagiaplus.onrender.com"
);
window.API_BASE_URL = API_BASE_URL;

const toggleAuth = document.getElementById("toggleAuth");

const formTitle = document.getElementById("formTitle");

let loginMode = true;

// TOGGLE
toggleAuth.addEventListener("click", () => {

    loginMode = !loginMode;

    if (loginMode) {

        loginForm.style.display = "flex";
        registerForm.style.display = "none";

        formTitle.innerText = "Iniciar sesión";

        toggleAuth.innerHTML = `
            ¿No tenés cuenta?
            <span>Crear cuenta</span>
        `;

    } else {

        loginForm.style.display = "none";
        registerForm.style.display = "flex";

        formTitle.innerText = "Crear cuenta";

        toggleAuth.innerHTML = `
            ¿Ya tenés cuenta?
            <span>Iniciar sesión</span>
        `;
    }
});

// LOGIN
loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;

    const password = document.getElementById("loginPassword").value;

    try {

        const res = await fetch(
            `${API_BASE_URL}/api/auth/login`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await res.json();

        if(!data.success){

            alert(data.message);

            return;
        }

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        localStorage.setItem(
            "token",
            data.token
        );

        alert("Bienvenido ✔");

        window.location.href = "index.html";

    } catch(error){

        console.log(error);

        alert("Error login");
    }
});

// REGISTER
registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();

    const email = document.getElementById("registerEmail").value.trim();

    const password = document.getElementById("registerPassword").value.trim();

    if (!name || !email || !password) {

        alert("Completar todos los campos");

        return;
    }

    try {

        const res = await fetch(
            `${API_BASE_URL}/api/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );



const data = await res.json();

console.log("STATUS:", res.status);
console.log("REGISTER RESPONSE:", data);

if (!res.ok) {

    alert(
        data.message ||
        data.error ||
        "Error al crear cuenta"
    );

    return;
}

if (!data.success) {

    alert(
        data.message ||
        data.error ||
        "Error al crear cuenta"
    );

    return;
}

        // SUCCESS
        alert("Cuenta creada correctamente ✔");

        loginMode = true;

        loginForm.style.display = "flex";

        registerForm.style.display = "none";

        formTitle.innerText = "Iniciar sesión";

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        alert("Error de conexión con el servidor");
    }
});
