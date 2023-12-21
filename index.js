import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
    console.log("Client Connected");

    // Đánh dấu client là 'alive' khi kết nối
    ws.isAlive = true;

    ws.on('pong', () => {
        // Đánh dấu lại client là 'alive' khi nhận được pong
        ws.isAlive = true;
    });

    ws.on('message', (message) => {
        console.log("Received: ", message);
    });

    ws.on('close', () => {
        console.log("Connection closed");
    });

    // Gửi tin nhắn khi kết nối được thiết lập
    ws.send("Message from server");
});

// Thiết lập việc ping định kỳ
setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();
        
        ws.isAlive = false;
        ws.ping();
    });
}, 30000); // Ví dụ ở đây là 30 giây

console.log("WebSocket server is running on port ", PORT);
