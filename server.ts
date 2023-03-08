import express from "express";
import Pusher from "pusher";

const pusher = new Pusher(
    {
        host: "127.0.0.1",
        port: "6001",
        useTLS: false,
        appId: "myapp",
        key: "myapp-key",
        secret: "myapp-secret"
    }
)

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.get("/", (req: any, res: any) => {
    res.send("Server running!");
});

app.post("/auth", (req, res) => {
    try {
        const { socket_id, channel_name } = req.body;

        // must provide a socket id
        if (!socket_id) {
            return res.status(400).end();
        }

        if (!channel_name) {
            // this is an authentication request
            console.log("Authenticating user…!");

            // check credentials
            const { id, password } = req.body;
            if (!id || !password) {
                return res.status(401).end();
            }

            const auth = pusher.authenticateUser(socket_id, {
                id: id,
                user_info: {
                    name: id
                },
                watchlist: [],
            });

            console.log("connection auth:", auth);
            res.send(auth);
        } else {
            // this is a subscription request
            const auth = pusher.authorizeChannel(socket_id, channel_name);
            console.log("subscription auth:", auth);
            res.send(auth);
        }
    } catch (e) {
        console.error("error in auth:", e);
        res.status(500).end();
    }
});

app.all("/webhook", (req, res) => {
    try {
        console.log('⭐️Webhook:', req.body);
        res.status(200).end();
    } catch (e) {
        console.error("error in webhook:", e);
        res.status(500).end();
    }
});

const server = app.listen(4000, () => {
    console.assert(typeof server.address() === "object");
    console.log(
        `[Server]: Server is running at http://localhost:4000`
    );
});
