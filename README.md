# rxdb-websocket-problem

Repo to reproduce [rxdb issue #6141](https://github.com/pubkey/rxdb/issues/6141).

## Commands

Start the backend server first. Follow the steps described in [rxdb-websocket-problem-backend](https://github.com/WebWareDev/rxdb-websocket-problem-backend).

```sh
npm i
npm run dev
```

The terminal will display the URL where the frontend should now be running.
(By default, http://localhost:5173/)

### Bug Reproduce Scenario

If everything is working correctly, two buttons named "Update Service Plan" and "Update Service Object" should appear.
If this is the case, then please open the application side by side in two different browsers (e.g., Chrome and Firefox).

The following should happen:

1. Click on "Update Service Plan" -> The description of the plan is changed and synced. A refresh button appears in both browsers. Both receive the data via WebSocket and therefore indicate that new data is available.

2. Click on "Update Service Object" -> The description of the object is changed and synced. However, the refresh button only appears in one of the browsers, althought they both get websocket data (Network inspection). Upon the second execution, the refresh button does not appear in either browser. (Suspected bug due to composite primary keys)
