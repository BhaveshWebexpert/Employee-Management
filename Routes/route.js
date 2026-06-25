import express from "express";
import UserController from "../Controllers/UserController.js";
import EmployeeController from "../Controllers/EmployeeController.js";

const router = express.Router();

router.get("/", (req,res)=>{res.send("<h1>Hello world</h1>")});


router.post("/api/register", UserController.Registration);
router.post("/api/login", UserController.Login);


router.post("/api/addEmp", EmployeeController.Addemployee);
router.get("/api/getEmp", EmployeeController.getEmployeeList);
router.get("/api/getEmp/:id", EmployeeController.getEmployee);
router.put("/api/updateEmp/:id", EmployeeController.updateEmployee);
router.delete("/api/deleteEmp/:id", EmployeeController.deleteEmployee);


export default router;