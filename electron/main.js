const { app, BrowserWindow } = require('electron');
const waitOn = require('wait-on');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Ładujemy stronę dopiero po tym, jak serwer Express będzie dostępny
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  // Oczekiwanie na dostępność serwera na porcie 3000
  waitOn({
    resources: ['http://localhost:3000'],
    timeout: 30000, // Czas oczekiwania na serwer (np. 30 sekund)
  })
    .then(() => {
      createWindow(); // Po uzyskaniu dostępu do serwera, otwórz okno Electron
    })
    .catch((error) => {
      console.error('Błąd oczekiwania na serwer:', error);
      app.quit(); // Zakończ aplikację, jeśli nie uda się połączyć z serwerem
    });
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
