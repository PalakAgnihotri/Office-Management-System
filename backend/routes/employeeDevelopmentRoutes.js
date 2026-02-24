const express = require("express");

const router = express.Router();

const {verifyToken} =
require("../middleware/authMiddleware");


const {

  createEmployeeTask,
  getEmployeeTasks,
  updateEmployeeTask,
  deleteEmployeeTask

}
=
require("../controllers/employeeDevelopmentController");



router.post(
"/create",
verifyToken,
createEmployeeTask
);


router.get(
"/my",
verifyToken,
getEmployeeTasks
);


router.put(
"/:id",
verifyToken,
updateEmployeeTask
);


router.delete(
"/:id",
verifyToken,
deleteEmployeeTask
);


module.exports = router;