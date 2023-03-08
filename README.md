# A Soketi Bug: Minimal, Verifiable and Complete Example

Install dependencies and build the apps

```bash
yarn install && yarn build
```

Run the apps in two separate terminals. You will need ports `3000`, `4000` and `6001` available. 

1. Run the Soketi server on port `6001`

```bash
yarn soketi
```

2. Run the backend on port `4000`:

```bash
yarn dev-server
```

3. Run the client on port `3000`:

```bash
yarn dev-client
```

---

You can alternatively run the client and backend on the same terminal, to see the merged logs:

```bash
yarn dev
```

---

## Actual behavior

The client will fail to subscribe to the presence channel.

The server will log the channel authentication attempt, but no further logging happens anywhere.

## Expected behavior

The client should be able to subscribe to the presence channel.

The server should log the channel authentication attempt, and then log the successful subscription.

The backend should log the subscription event, received via webhook.
