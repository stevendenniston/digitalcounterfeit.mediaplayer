import express from "express";
import ReactDOMServer from "react-dom/server";

import App from "../components/App";

const server = express();
server.use(express.static("dist"));

server.get("/", (req, res) => {
  const initialMarkup = ReactDOMServer.renderToString(<App />);

  res.send(`
    <html>
      <head>
        <title>DigitalCounterfeit Media Player</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp">
      </head>
      <body>
        <div id="app">${initialMarkup}</div>
        <script src="/main.js"></script>
      </body>
    </html>
  `);
});

server.listen(4242, () => console.log("Server is running..."));
