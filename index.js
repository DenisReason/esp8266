import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors'

// Khởi tạo Express app
const app = express();
app.use(cors({
    origin:"http://localhost:19006",
    methods:["GET", "POST"]
    
}))
const PORT = process.env.PORT || 3000;

// Sử dụng body-parser để xử lý JSON từ body request
app.use(express.json());

// Lưu trữ client WebSocket
let connectedWs = null;

// Tạo WebSocket server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
    console.log("WebSocket client connected");
    connectedWs = ws;
    ws.isAlive=true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (message) => {
        console.log("Received message:", message);
    });
    console.log("Here!!!!!!");
    ws.on('close', () => {
        console.log("WebSocket connection closed");
    });
});

// Xử lý HTTP POST request tới /data
app.post('/data', (req, res) => {
    console.log('HTTP POST request received at /data:', req.body);
    if (req.body.script === "moveForward" && connectedWs) {
        connectedWs.send("moveForward");
    }
    else if(req.body.script ==="turnLeft" && connectedWs){
        connectedWs.send("turnLeft")
    }
    else if(req.body.script ==="turnRight" && connectedWs){
        connectedWs.send("turnRight")
    }
    else if(req.body.script ==="moveBack" && connectedWs){
        connectedWs.send("moveBack")
    }
    res.json({ message: 'Command received and processed' });
});

// Tạo HTTP server từ Express app
const server = createServer(app);

// Xử lý yêu cầu nâng cấp từ HTTP sang WebSocket
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Khởi chạy server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Thiết lập việc ping định kỳ để kiểm tra các client WebSocket
setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();

        ws.isAlive = false;
        ws.ping();
        console.log("Ping is sending");
    });
}, 30000); // Ví dụ ở đây là 30 giây
