const { app, BrowserWindow } = require('electron')
const path = require('path')
const http = require('http')
const fs = require('fs')

let mainWindow
let server

const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
}

function startServer(distPath, port) {
  return new Promise((resolve) => {
    server = http.createServer((req, res) => {
      let filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url)

      // SPA fallback — serve index.html for unknown routes
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distPath, 'index.html')
      }

      const ext  = path.extname(filePath)
      const mime = MIME_TYPES[ext] || 'application/octet-stream'

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404)
          res.end('Not found')
          return
        }
        res.writeHead(200, { 'Content-Type': mime })
        res.end(data)
      })
    })

    server.listen(port, '127.0.0.1', () => {
      console.log(`Local server on port ${port}`)
      resolve(port)
    })

    server.on('error', () => {
      // Puerto ocupado — intentar con el siguiente
      server.close()
      startServer(distPath, port + 1).then(resolve)
    })
  })
}

async function createWindow() {
  const distPath = path.join(__dirname, '..', 'dist')
  const isDev    = !fs.existsSync(path.join(distPath, 'index.html'))

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    title: 'AutoTaller',
    autoHideMenuBar: true,
    backgroundColor: '#0f1117',
    show: false,
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    const port = await startServer(distPath, 34599)
    mainWindow.loadURL(`http://127.0.0.1:${port}`)
  }

  mainWindow.on('closed', () => {
    if (server) server.close()
  })
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (server) server.close()
  app.quit()
})
