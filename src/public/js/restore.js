const form = document.getElementById("restoreForm");
const emailInput = document.getElementById("emailInput");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(emailInput.value);
  fetch("/api/sessions/restore", {
    method: "POST",
    body: JSON.stringify({
      email: emailInput.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    console.log(response);
    if (response.status === 200) {
      window.location.replace("/");
      console.log("exito");
    } else {
      console.log("algo salio mal");
    }
  });
});
