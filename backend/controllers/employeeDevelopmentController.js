const db = require("../config/db");


/*
 ================================
 CREATE TASK
 ================================
*/
const createEmployeeTask = async (req, res) => {

  try {

    const {
      title,
      description,
      status,
      due_date,
      allotted_hours
    } = req.body;

    await db.execute(
      `
      INSERT INTO employee_development_tasks
      (
        employee_id,
        title,
        description,
        status,
        due_date,
        allotted_hours
      )
      VALUES (?,?,?,?,?,?)
      `,
      [
        req.user.id,
        title,
        description || null,
        status || "Pending",
        due_date || null,
        allotted_hours || null
      ]
    );

    res.json({
      message: "Employee development task created"
    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

};



/*
 ================================
 GET MY TASKS
 ================================
*/
const getEmployeeTasks = async (req, res) => {

  try {

    const [tasks] = await db.execute(
      `
      SELECT *
      FROM employee_development_tasks
      WHERE employee_id = ?
      ORDER BY id DESC
      `,
      [req.user.id]
    );

    res.json(tasks);

  }
  catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};



/*
 ================================
 UPDATE TASK
 ================================
*/
const updateEmployeeTask = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      title,
      description,
      status,
      due_date,
      allotted_hours
    } = req.body;


    const [result] = await db.execute(
      `
      UPDATE employee_development_tasks
      SET
        title = ?,
        description = ?,
        status = ?,
        due_date = ?,
        allotted_hours = ?
      WHERE id = ?
      AND employee_id = ?
      `,
      [
        title ?? null,
        description ?? null,
        status ?? null,
        due_date ?? null,
        allotted_hours ?? null,
        id,
        req.user.id
      ]
    );


    if(result.affectedRows === 0){

      return res.status(404).json({
        message:"Task not found"
      });

    }


    res.json({
      message:"Task updated successfully"
    });

  }
  catch(error){

    console.error(error);

    res.status(500).json({
      error:error.message
    });

  }

};



/*
 ================================
 DELETE TASK
 ================================
*/
const deleteEmployeeTask = async (req, res) => {

  try {

    const { id } = req.params;


    const [result] = await db.execute(
      `
      DELETE FROM employee_development_tasks
      WHERE id = ?
      AND employee_id = ?
      `,
      [
        id,
        req.user.id
      ]
    );


    if(result.affectedRows === 0){

      return res.status(404).json({
        message:"Task not found"
      });

    }


    res.json({
      message:"Task deleted successfully"
    });

  }
  catch(error){

    console.error(error);

    res.status(500).json({
      error:error.message
    });

  }

};



module.exports = {

  createEmployeeTask,
  getEmployeeTasks,
  updateEmployeeTask,
  deleteEmployeeTask

};