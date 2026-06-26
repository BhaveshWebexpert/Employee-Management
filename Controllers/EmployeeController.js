import Employee from "../Models/Employee.js";

const Addemployee = async (req,res)=>{
    try {
        const {fullName,email,mobile,department,designation,dateOfJoining,salary,status} = req.body;
        const emailExists = await Employee.findOne({ email });
        if (emailExists) return res.status(400).json({ status: 'false', message: "Email is already registered" });
        const emp = new Employee({fullName, email, mobile, department, designation, dateOfJoining,salary, status});
        await emp.save();
        return res.status(201).json({ status: true, message: "New emp is added successfullt..", data: emp});
    } catch (e) {
        console.log(`Error in Login from Usercontroller : ${e}`);
        if (e.name === "ValidationError") {
            const errors = Object.values(e.errors).map((err) => err.message);
            return res.status(422).json({ status: false, error: errors });
        }
        return res.status(500).json({ status: false, error: "oops!something went wrong on server...", data: e.stack || e });
    }
};

const getEmployeeList = async (req,res)=>{
    try {
        const page = Math.max(parseInt(req.query.page) || 1);
        const limit = Math.min(parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;
        const total = await Employee.countDocuments();

        const empList = await Employee.find().skip(skip).limit(limit);
        
        return res.status(200).json({ status: true, message: "Employee list is fetched successfully...", data: empList, currentPage:page, totalPages:Math.ceil(total/limit), totalItems:total });
    } catch (e) {
        console.log(`Error in getEmployee from Usercontroller : ${e}`);
        if (e.name === "ValidationError") {
            const errors = Object.values(e.errors).map((err) => err.message);
            return res.status(422).json({ status: false, error: errors });
        }
        return res.status(500).json({ status: false, error: "oops!something went wrong on server...", error: e.stack || e });
    }
}

const getEmployee = async (req,res)=>{
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ status: false, message: "Employee ID is compulsory." });
        const emp = await Employee.findById(id);
        if (!emp) return res.status(404).json({ status: false, message: "Emp does not exist." });
        return res.status(200).json({ status: true, message: "Employee list is fetched successfully...", data: emp });
    } catch (e) {
        console.log(`Error in getEmployee from Usercontroller : ${e}`);
        if (e.name === "ValidationError") {
            const errors = Object.values(e.errors).map((err) => err.message);
            return res.status(422).json({ status: false, error: errors });
        }
        return res.status(500).json({ status: false, error: "oops!something went wrong on server...", error: e.stack || e });
    }
}

const updateEmployee = async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, email, mobile, department, designation, dateOfJoining, salary, status } = req.body;

      if (!id) return res.status(400).json({ status: false, message: "Employee ID is compulsory." });

      const updateData = {};
      if (fullName !== undefined) updateData.fullName = fullName;
      if (email !== undefined) updateData.email = email;
      if (mobile !== undefined) updateData.mobile = mobile;
      if (department !== undefined) updateData.department = department;
      if (designation !== undefined) updateData.designation = designation;
      if (dateOfJoining !== undefined) updateData.dateOfJoining = dateOfJoining;
      if (salary !== undefined) updateData.salary = salary;
      if (status !== undefined) updateData.status = status;

      const updateEmp = await Employee.findOneAndUpdate(
          { _id: id },
          { $set: updateData },
          { returnDocument: "after", runValidators: true }
      );

      if (!updateEmp) return res.status(404).json({ status: false, message: "Emp does not exist." });

      return res.status(200).json({ status: true, message: "Emp is updated successfully...", data: updateEmp });
    } catch (e) {
      console.log(`Error in updateEmployee: ${e}`);
      if (e.name === "ValidationError") {
        const messages = Object.values(e.errors).map((err) => err.message);
        return res.status(422).json({ status: false, message: "Validation failed", data: messages });
      }
      if (e.name === "CastError") {
        return res.status(400).json({ status: false, message: "Invalid Employee ID format." });
      }
      return res.status(500).json({ status: false, message: "Oops! Something went wrong on the server...", data: e.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ status: false, message: "Employee ID is compulsory." });
        const del = await Employee.findByIdAndDelete(id);
        if (!del) return res.status(404).json({ status: false, message: "Emp does not exist." });
        return res.status(200).json({ status: true, message: "Emp is deleted successfully...", data: del });
    } catch (e) {
        console.log(`Error in deleteEmployee: ${e}`);
        if (e.name === "CastError") {
        return res.status(400).json({ status: false, message: "Invalid Employee ID format." });
        }
        return res.status(500).json({ status: false, message: "Oops! Something went wrong on the server...", data: e.message });
    }
};

const searchEmployee = async (req,res)=>{
    try {
        switch (Object.keys(req.body)[0]) {
            case "fullName":
                const key = Object.keys(req.body)[0].trim();
                const value = Object.values(req.body)[0].trim();
                const emps = await Employee.find({ [key]: value });
                if (!emps.length) {
                    return res.status(404).json({ status: false, message: "Employee does not exists."});
                }
                return res.status(200).json({ status: true, message: "Employees are retrieved", data:emps });
            break;
            case "empCode":
                const keys = Object.keys(req.body)[0].trim();
                const values = Object.values(req.body)[0].trim();
                const emp = await Employee.find({ [keys]: values });
                if (!emp.length) {
                    return res.status(404).json({ status: false, message: "Employee does not exists with this code."});
                }
                return res.status(200).json({ status: true, message: "Employees are retrieved", data:emp });
                break;
            default:
                return res.status(400).json({ status: false, message: "Invalid search type entered." });
        }
    } catch (e) {
        console.log(`Error in getEmployee from Usercontroller : ${e}`);
        if (e.name === "ValidationError") {
            const errors = Object.values(e.errors).map((err) => err.message);
            return res.status(422).json({ status: false, error: errors });
        }
        return res.status(500).json({ status: false, error: "oops!something went wrong on server...", error: e.stack || e });
    }
}

export default {
    Addemployee,
    getEmployeeList,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployee
}