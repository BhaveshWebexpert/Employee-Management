import mongoose from "mongoose";

const employeeSchema = mongoose.Schema({
    empCode :{required:true, type:String, unique: true, default:generateEmpCode},
    fullName : {required:true, type:String,},
    email : {required:true, type:String, unique: true, validate:{
        validator: function(value){
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); 
        },
        message: (prop) =>`${prop.value} is not a valid email address.`
    }},
    mobile:{required:true, type:String, trim:true, match: [/^\d{10}$/, "Mobile number must be a number and exactly 10 digits"],},
    department: {required:true, type:String},
    designation: {required:true, type:String},
    dateOfJoining: {required:true, type:Date, validate:{
        validator: function(value){
            return value <= new Date();      
        },
        message: ()=> "Joining Date cant be the future date.",
    }},
    salary: {required:true, type:Number, min:[0,"Minimum salaray at least should be 0"]},
    status: {required:false, type:Boolean}
});

function generateEmpCode() {
    const date = new Date();

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours;
    const hh = String(hours).padStart(2, "0");

    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    const ms = String(date.getMilliseconds()).padStart(3, "0");

    const rand = String(Math.floor(Math.random() * 100)).padStart(5, "0");
    return `EMP-${dd}${mm}${yyyy}${hh}${min}${ss}${ms}${rand}`;
}

export default mongoose.model('Employee', employeeSchema, 'employees');