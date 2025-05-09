const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

if (registerBtn && container) {
  registerBtn.addEventListener('click', () => {
    container.classList.add("active");
  });
}

if (loginBtn && container) {
  loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // LOGIN FORM
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[name="email"]').value;
      const password = loginForm.querySelector('input[name="password"]').value;

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          window.location.href = "/index.html";
        } else {
          alert("Login failed. Please check your email and password.");
        }
      } catch (err) {
        console.error("Error during login:", err);
      }
    });
  }

  // REGISTER FORM
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = registerForm.querySelector('input[name="name"]').value;
      const email = registerForm.querySelector('input[name="email"]').value;
      const password = registerForm.querySelector('input[name="password"]').value;

      // Get the current date
      const currentDate = new Date().toISOString();

      try {
        const response = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, registrationDate: currentDate }),
        });

        const data = await response.json();
        if (data.status === 'success') {
          alert("Registration successful!");
          window.location.href = "login.html";
        } else {
          alert("Registration failed: " + data.message);
        }
      } catch (err) {
        console.error("Error during registration:", err);
        alert("Something went wrong.");
      }
    });
  }
});
  