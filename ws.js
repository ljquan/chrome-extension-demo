// server.js
import WebSocket, { WebSocketServer } from 'ws';
import { watch } from 'chokidar';

const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  }
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  });

  ws.send('Hello! Message From Server!!');
});

function broadcast(data) {
  data = typeof data === 'object' ? JSON.stringify(data) : data;
  console.log('broadcast', data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// 在你的构建脚本中添加以下代码， 当构建完成后，由服务器向chrome插件发送消息
// nodemon -e ts --exec "npm run build && node server.js" -w vite.config.ts -w src/

// server.js
// ...
// When build is complete
broadcast('reload');
let isReloadBackground = false;
let changeFile = '';
watch(['src/'], {
  ignored: /node_modules|dist/,
  persistent: true
}).on('change', async (filePath) => {
  console.log('change', filePath);
  if (filePath.includes('background') || filePath.includes('manifest.ts')) {
    isReloadBackground = true;
    changeFile = filePath;
  } else if (!isReloadBackground) {
    changeFile = filePath;
  }
});

let timer;
watch('dist/').on('change', async (filePath) => {
    console.log('change', filePath);
    clearTimeout(timer)
    timer = setTimeout(()=>{
        if (isReloadBackground) {
            broadcast({
              action: 'chrome-reload',
              changeFile,
              time: new Date()
            });
            isReloadBackground = false;
        } else {
            broadcast({
            action: 'location-reload',
            changeFile,
            time: new Date()
          });
        }

    }, 100);
  });