const express = require("express");
const cors = require("cors");
const http = require("http");

const { Server } = require("socket.io");

const logger = require("./middleware/logger");

const notificationRoutes =
require("./routes/notificationRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());

app.use(express.json());

app.use(logger);

app.use("/api/notifications",
notificationRoutes);

app.get("/", (req, res) => {

    res.json({
        message: "Backend Running"
    });

});

io.on("connection", (socket) => {

    console.log("User connected");

    setInterval(() => {

        const randomNotifications = [
            {
                ID: Date.now().toString(),
                Type: "Placement",
                Message: "Microsoft hiring drive",
                Timestamp:
                    new Date().toLocaleString(),
                priorityScore: 5000
            },
            {
                ID: Date.now().toString(),
                Type: "Result",
                Message: "Mid sem results declared",
                Timestamp:
                    new Date().toLocaleString(),
                priorityScore: 4000
            },
            {
                ID: Date.now().toString(),
                Type: "Event",
                Message: "Tech fest announced",
                Timestamp:
                    new Date().toLocaleString(),
                priorityScore: 3000
            }
        ];

        const randomNotification =
            randomNotifications[
                Math.floor(
                    Math.random() * 3
                )
            ];

        socket.emit(
            "new_notification",
            randomNotification
        );

    }, 10000);

});

const PORT = 5000;

server.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});