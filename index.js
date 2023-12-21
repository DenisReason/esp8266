import {WebSocketServer} from "ws";
const PORT = process.env.PORT||3000

const wss = new WebSocketServer({port:PORT})

wss.on('connection',(ws)=>{
    console.log("Client Connected");

    ws.on('message', (message)=>{
        console.log("received: ", message)

    })
    ws.on('close',()=>{
        console.log("Connection closed")
    })
    ws.send("Message from server")
})
console.log("Websocket server is running on port ",PORT)