document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      document.getElementById("errorMsg").textContent = data.error || "Login failed";
      return;
    }

    // Save token in localStorage
    localStorage.setItem("token", data.token);

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } catch (err) {
    document.getElementById("errorMsg").textContent = "Server error, try again!";
    console.error(err);
  }
});
