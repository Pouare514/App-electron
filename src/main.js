const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Charge le fichier preload
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true
    },
    // Ajout de ces options pour mieux gérer le chargement
    show: false,
    backgroundColor: '#1E1E1E'
  });

  // Afficher la fenêtre une fois prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('Window ready to show');
  });

  // Gérer les erreurs de chargement
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  });

  // Gestion des erreurs
  mainWindow.webContents.on('crashed', (event) => {
    console.error('Application crashed:', event);
    app.relaunch();
    app.exit(0);
  });

  // Déboguer le chargement
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
    const memory = process.getProcessMemoryInfo();
    console.log('Utilisation mémoire:', memory);
  });

  // Modifier la gestion de la navigation
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Autoriser la navigation interne sans restrictions
    if (url.startsWith('file://')) {
      console.log('Navigation interne vers:', url);
      return;
    }
    // Bloquer uniquement les liens externes
    event.preventDefault();
    console.warn('Navigation externe bloquée:', url);
  });

  // Charge le fichier HTML principal depuis le dossier src
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Raccourcis clavier globaux
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.toggleDevTools();
  });

  globalShortcut.register('CommandOrControl+R', () => {
    mainWindow.reload();
  });

  // Ajouter les raccourcis pour le zoom
  globalShortcut.register('CommandOrControl+-', () => {
    const currentZoom = mainWindow.webContents.getZoomLevel();
    mainWindow.webContents.setZoomLevel(currentZoom - 0.5);
  });

  globalShortcut.register('CommandOrControl+=', () => {
    const currentZoom = mainWindow.webContents.getZoomLevel();
    mainWindow.webContents.setZoomLevel(currentZoom + 0.5);
  });

  globalShortcut.register('CommandOrControl+0', () => {
    mainWindow.webContents.setZoomLevel(0);
  });

  // Ouvrir les DevTools en développement
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// App prête à créer la fenêtre principale
app.whenReady().then(createWindow);

ipcMain.on('toggle-theme', (event) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send('toggle-theme');
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Nettoyage lors de la fermeture
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Gestion du mode veille
app.on('suspend', () => {
  console.log('Système en veille');
});

app.on('resume', () => {
  console.log('Système reprend');
});
