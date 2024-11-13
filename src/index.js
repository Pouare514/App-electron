// Gestion du thème clair/sombre
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing application...');
    
    const toggleThemeButton = document.querySelector("#toggle-theme");
    if (!toggleThemeButton) {
        console.error('Toggle theme button not found');
        return;
    }

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
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      rootElement.classList.add("light-mode");
    }
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Gestion des boutons interactifs
const positiveButton = document.querySelector("#positive-button");
const dangerButton = document.querySelector("#danger-button");

// Système de notification amélioré
class NotificationManager {
  constructor() {
    this.queue = [];
    this.isShowing = false;
  }

  show(message, type = 'info', duration = 3000) {
    this.queue.push({ message, type, duration });
    if (!this.isShowing) this.processQueue();
  }

  processQueue() {
    if (this.queue.length === 0) {
      this.isShowing = false;
      return;
    }

    this.isShowing = true;
    const { message, type, duration } = this.queue.shift();
    const notification = this.createNotification(message, type);

    setTimeout(() => {
      notification.remove();
      this.processQueue();
    }, duration);
  }

  createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="notification-icon">${this.getIcon(type)}</span>
      <span class="notification-message">${message}</span>
    `;
    document.body.appendChild(notification);
    return notification;
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };
    return icons[type] || icons.info;
  }
}

const notifications = new NotificationManager();

// Usage amélioré des notifications
positiveButton.addEventListener("click", () => {
  notifications.show("Action positive réussie!", "success");
});

dangerButton.addEventListener("click", () => {
  if (confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) {
    notifications.show("Action de suppression effectuée.", "error");
  }
});
