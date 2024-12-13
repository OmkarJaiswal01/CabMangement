const express = require("express");
const Admin_Routers = express.Router();
const multer = require('multer');
const path = require('path');

// Import Controllers
const AdminController = require("../Controller/AdminController");
const BusinessUnitsController = require("../Controller/BusinessUnitsController");
const LocationController = require("../Controller/LocationController");
const DepartmentController = require("../Controller/DepartmentController");
const AddUserController = require("../Controller/AddUserController");
const AccessTabController = require("../Controller/AccessTabController");
const RiderController = require("../Controller/RiderController");

Admin_Routers.use(express.json());

// Multer Storage for Admin Image Upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './public/adminImage'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });


/* ================== Admin Routes ================== */
Admin_Routers.post("/AdminSignUp", upload.single('image'), AdminController.AdminSignUp);
Admin_Routers.get("/email-verified", AdminController.verifyMail);
Admin_Routers.post("/AdminSignIn", AdminController.AdminSignIn);

/* ================== Business Units Routes ================== */
Admin_Routers.post("/BusinessUnits", BusinessUnitsController.InsertBusinessUnit);
Admin_Routers.get("/BusinessUnits", BusinessUnitsController.getBusinessUnit);
Admin_Routers.get("/BusinessUnitsA/:businessUnitId", BusinessUnitsController.getBusinessUnitAcc);

/* ================== Locations Routes ================== */
Admin_Routers.post("/Locations", LocationController.insertLocation);
Admin_Routers.get("/Locations", LocationController.getInsertLocation);

/* ================== Departments Routes ================== */
Admin_Routers.post("/Departments", DepartmentController.InsertDepartment);
Admin_Routers.get("/Departments", DepartmentController.getDepartment);
Admin_Routers.get("/DepartmentAccBusinessUnit/:businessUnitId", DepartmentController.getDepartmentAccBusinessUnit);

/* ================== Teams Routes ================== */
Admin_Routers.post("/teams", AdminController.InsertTeams);
Admin_Routers.get("/getTeamsDetails", AdminController.getTeamsDetails);
Admin_Routers.get("/getTeamsAccDepartment/:DepartmentId", AdminController.getTeamAccDepartment);
Admin_Routers.get("/teamDetails/:teamId", AdminController.getTeamInfo);

/* ================== Position Routes ================== */
Admin_Routers.post("/positionName", AdminController.InsertPosition);
Admin_Routers.get("/positions", AdminController.GetPositions);
Admin_Routers.get("/position/:id", AdminController.GetPositionsDetails);

/* ================== Add User Routes ================== */
Admin_Routers.post("/addUser", AddUserController.inserUser);
Admin_Routers.get("/GetaddUser", AddUserController.GetUserAdd);
Admin_Routers.post("/SignIn", AddUserController.signIn);
Admin_Routers.get("/users/:id", AddUserController.getUserById);
Admin_Routers.delete('/users/:id', AddUserController.DeleteUser);
Admin_Routers.put('/users/updateCab', AddUserController.updateCab);

/* ================== Access Tab Routes ================== */
Admin_Routers.post("/teamDetails/:teamId/updateAccess", AccessTabController.accessTab);
Admin_Routers.get("/teamDetails/:teamId/access", AccessTabController.getAccessTabs);

/* ================== Rider Routes ================== */
// Rider CRUD Routes
Admin_Routers.post("/Riders", RiderController.createRider); 
Admin_Routers.get("/Riders", RiderController.getAllRiders);
Admin_Routers.get("/Riders/:id", RiderController.getRiderById);
Admin_Routers.put("/Riders/:id", RiderController.updateRider);
Admin_Routers.delete("/Riders/:id", RiderController.deleteRider);

// Ride Control Routes
Admin_Routers.post("/startRide", RiderController.startRide); // Changed to POST for state changes
Admin_Routers.post("/stopRide", RiderController.stopRide);   // Changed to POST for state changes
Admin_Routers.get("/activeRiders", RiderController.getActiveRiders);
Admin_Routers.get("/expiredRiders", RiderController.getExpiredRiders);
Admin_Routers.post('/Assets', RiderController.InsertAssets);


module.exports = Admin_Routers;
