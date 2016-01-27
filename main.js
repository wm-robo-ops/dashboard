'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1000, height: 800});
  mainWindow.loadURL('file://' + __dirname + '/index.html'); // eslint-disable-line no-path-concat
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
