const { contextBridge, ipcRenderer } = require('electron');

// Expose une API sécurisée au processus de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  sendNotification: (message) => ipcRenderer.send('show-notification', message)
});

contextBridge.exposeInMainWorld('electron', {
  toggleTheme: () => ipcRenderer.send('toggle-theme')
});
