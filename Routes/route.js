import express from "express";
import UserController from "../Controllers/UserController.js";

const router = express.Router();

router.get("/", (req,res)=>{res.send("<h1>Hello world</h1>")});


router.post("/api/register", UserController.Registration);
router.post("/api/login", UserController.Login);


export default router;