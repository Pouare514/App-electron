const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Charge le fichier preload
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  // Charge le fichier HTML principal depuis le dossier src
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
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
