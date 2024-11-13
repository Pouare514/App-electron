document.addEventListener('DOMContentLoaded', () => {
    // Chargement des paramètres sauvegardés
    loadSettings();

    // Gestionnaires d'événements pour les paramètres
    document.getElementById('theme-select').addEventListener('change', (e) => {
        const theme = e.target.value;
        saveSettings('theme', theme);
        applyTheme(theme);
    });

    document.getElementById('font-size').addEventListener('input', (e) => {
        const size = e.target.value;
        document.documentElement.style.fontSize = size + 'px';
        saveSettings('fontSize', size);
    });

    document.getElementById('enable-notifications').addEventListener('change', (e) => {
        saveSettings('notifications', e.target.checked);
        if (e.target.checked) {
            requestNotificationPermission();
        }
    });

    document.getElementById('enable-animations').addEventListener('change', (e) => {
        saveSettings('animations', e.target.checked);
        document.body.classList.toggle('disable-animations', !e.target.checked);
    });

    document.getElementById('clear-cache').addEventListener('click', async () => {
        try {
            await window.electronAPI.clearCache();
            notifications.show('Cache vidé avec succès', 'success');
        } catch (error) {
            notifications.show('Erreur lors du vidage du cache', 'error');
        }
    });

    // Gestion de la taille de police
    const fontSizeSlider = document.getElementById('font-size');
    fontSizeSlider.addEventListener('input', (e) => {
        const newSize = e.target.value;
        document.body.style.fontSize = `${newSize}px`;
        saveSettings('fontSize', newSize);
    });
});

// Fonctions utilitaires
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    
    // Appliquer les paramètres chargés
    document.getElementById('theme-select').value = settings.theme || 'system';
    document.getElementById('font-size').value = settings.fontSize || '16';
    document.getElementById('enable-notifications').checked = settings.notifications !== false;
    document.getElementById('enable-animations').checked = settings.animations !== false;
    document.getElementById('notification-duration').value = settings.notificationDuration || '3';

    // Appliquer la taille de police sauvegardée
    const savedFontSize = settings.fontSize || '16';
    document.getElementById('font-size').value = savedFontSize;
    document.body.style.fontSize = `${savedFontSize}px`;
}

function saveSettings(key, value) {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    settings[key] = value;
    localStorage.setItem('settings', JSON.stringify(settings));
}

function applyTheme(theme) {
    if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('light-mode', !isDark);
    } else {
        document.documentElement.classList.toggle('light-mode', theme === 'light');
    }
}

async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            notifications.show('Permission de notification refusée', 'warning');
        }
    } catch (error) {
        console.error('Erreur de permission de notification:', error);
    }
}