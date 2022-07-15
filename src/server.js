import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
require('dotenv').config(); // Run process.env

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

viewEngine(app);
initWebRoutes(app);

let port = process.env.PORT || 6969; //Port in .env or 6969
app.listen(port, () => {
    console.log("Back-end NodeJS is running on the port : " + port);
});