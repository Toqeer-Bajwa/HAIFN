document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      formStatus.textContent = "⏳ Sending...";
      formStatus.style.color = "blue";

      try {
        const res = await fetch("http://localhost:4000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });

        const data = await res.json();

        if (res.ok) {
          formStatus.textContent = "✅ Message sent successfully!";
          formStatus.style.color = "green";
          contactForm.reset();
        } else {
          formStatus.textContent = "❌ " + (data.error || "Failed to send message");
          formStatus.style.color = "red";
        }
      } catch (err) {
        console.error("❌ Contact form error:", err);
        formStatus.textContent = "❌ Server error. Try again later.";
        formStatus.style.color = "red";
      }
    });
  }
});
