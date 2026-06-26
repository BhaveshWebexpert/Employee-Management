import express from "express";
import UserController from "../Controllers/UserController.js";
import EmployeeController from "../Controllers/EmployeeController.js";
import Authmiddleware from "../Middleware/Authmiddleware.js";

const router = express.Router();

router.get("/", (req,res)=>{res.send("<h1>Hello world</h1>")});


router.post("/api/register", UserController.Registration);
router.post("/api/login", UserController.Login);


router.post("/api/addEmp", Authmiddleware, EmployeeController.Addemployee);
router.get("/api/getEmp", Authmiddleware , EmployeeController.getEmployeeList);
router.get("/api/getEmp/:id", Authmiddleware , EmployeeController.getEmployee);
router.get("/api/empfilter", Authmiddleware , EmployeeController.filterEmployee);
router.get("/api/sortemp", Authmiddleware , EmployeeController.sortEmployee);
router.put("/api/updateEmp/:id", Authmiddleware , EmployeeController.updateEmployee);
router.delete("/api/deleteEmp/:id", Authmiddleware , EmployeeController.deleteEmployee);
router.post("/api/search", Authmiddleware , EmployeeController.searchEmployee);


export default router;