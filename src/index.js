// Gestion du thème clair/sombre
const toggleThemeButton = document.querySelector("#toggle-theme");
const rootElement = document.documentElement;

toggleThemeButton.addEventListener("click", () => {
  if (rootElement.classList.contains("light-mode")) {
    rootElement.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  } else {
    rootElement.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  }
});

document.getElementById('theme-toggle-button').addEventListener('click', () => {
  window.electron.toggleTheme();
});

window.electron.on('toggle-theme', () => {
  toggleTheme();
});

// Charger le thème depuis localStorage au démarrage
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    rootElement.classList.add("light-mode");
  }
});

// Gestion des boutons interactifs
const positiveButton = document.querySelector("#positive-button");
const dangerButton = document.querySelector("#danger-button");

positiveButton.addEventListener("click", () => {
  showNotification("Action positive réussie!", "success");
});

dangerButton.addEventListener("click", () => {
  if (confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) {
    showNotification("Action de suppression effectuée.", "error");
  }
});

// Fonction d'affichage des notifications
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerText = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
