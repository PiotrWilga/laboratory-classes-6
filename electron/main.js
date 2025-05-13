const { app, BrowserWindow } = require('electron');
const waitOn = require('wait-on');
const { exec } = require('child_process');

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
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  const serverProcess = exec('npm run start', (error, stdout, stderr) => {
    if (error) {
      console.error(`Błąd uruchomienia serwera: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  waitOn({
    resources: ['http://localhost:3000'],
    timeout: 30000,
  })
    .then(() => {
      createWindow();
    })
    .catch((error) => {
      console.error('Błąd oczekiwania na serwer:', error);
      app.quit();
    });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
