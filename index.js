import express from "express";
import routes from './Routes/route.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');


// Route
app.use("/", routes);




export default app;