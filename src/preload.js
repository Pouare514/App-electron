const { contextBridge, ipcRenderer } = require('electron');

// Expose une API sécurisée au processus de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  sendNotification: (message) => ipcRenderer.send('show-notification', message),
  
  // Monitoring
  logError: (error) => ipcRenderer.send('log-error', error),
  checkUpdates: () => ipcRenderer.invoke('check-updates'),
  
  // Analytics
  trackEvent: (eventName, data) => ipcRenderer.send('track-event', { eventName, data }),
  
  // État de l'application
  getAppStatus: () => ipcRenderer.invoke('get-app-status'),
  
  // Gestion du cache
  clearCache: () => ipcRenderer.invoke('clear-cache')
});

contextBridge.exposeInMainWorld('electron', {
  toggleTheme: () => ipcRenderer.send('toggle-theme')
});

contextBridge.exposeInMainWorld('navigation', {
  goToPage: (page) => {
    const validPages = ['index.html', 'parametres.html', 'profil.html', 'aide.html'];
    if (validPages.includes(page)) {
      window.location.href = page;
    }
  }
});
