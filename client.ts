import Pusher from "pusher-js";

// sleep for 1 second - give some time for the server and backend to start
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
await sleep(1000);

const pusher = new Pusher("myapp-key", {
  wsHost: "127.0.0.1",
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  userAuthentication: {
    endpoint: `http://localhost:4000/auth-user`,
    transport: "ajax",
    headers: {},
    params: {
      id: "user1",
      password: "user1",
    },
  },
  channelAuthorization: {
    endpoint: `http://localhost:4000/auth-channel`,
    transport: "ajax",
    headers: {},
    params: {
      id: "user1",
      password: "user1",
    },
  },
});

pusher.connection
  .bind("error", (err: any) => {
    console.log("Error:", err);
  })
  .bind_global((event: string, data: any) => {
    console.log("Received Event:", event, data);
  })
  .bind("connected", async ({ socket_id }: { socket_id: string }) => {
    console.log("Connected", socket_id);
    pusher.signin();
    console.log("Authenticated", socket_id);

    await sleep(500);
    console.log("going to subscribe to presence-channel...");

    pusher
      .subscribe("presence-channel")
      .bind_global((event: string, data: any) => {
        console.log("Presence Channel Event:", event, data);
      });

    pusher.subscribeAll();
  });

pusher.user.bind_global((event: string, data: any) => {
  console.log("User Event:", event, data);
});
