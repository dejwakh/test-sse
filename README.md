# test-sse

## What is it?
A proxy server using **server-sent-events (sse)** to push data to any number of streaming clients subscribed to a topic (using one-directional communication).

This server accepts post requests sent to `localhost:3000/topics/any_topic` and publishes them to any client listening to a streaming topic at `localhost:3000/topics/any_topic`.

## Built using:
1. Express + Node
2. ejs for templating
3. cors

## To test locally:
1. Download the repo & run `npm i`
2. Run `node server.js`
3. Go to `localhost:3000/topics/any_topic` on several different browser tabs, replacing `any_topic` with whatever topic you want to listen to
4. Open up a terminal, and send a Post request to the server by running:
`curl -X POST -s http://localhost:3000/topics/any_topic -H "Content-Type: application/json"  -d '{"key": "enter a key here", "value": "some value here"}'` and replace `any_topic` and the key-value pair as you please. (You can also use Postman instead to send this Post request)
5. See the new record append in all the browsers subscribed to that topic.

## Only two noteworthy files:
1. The Express server is contained in `server.js`
2. The client is contained in `views/client.ejs` (including JS)