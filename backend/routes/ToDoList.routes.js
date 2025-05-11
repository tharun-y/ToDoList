import express from 'express';
import { createNewTask, deleteTask, updateTasks, getAllTasks } from "../controllers/ToDoList.controller.js";

const router = express.Router();

// Define valid route patterns
router.post("/createNew", createNewTask);
router.delete("/delete", deleteTask);
router.put("/update/:assignment", updateTasks);  // Ensure you use :assignment here
router.get("/getall", getAllTasks);

export default router;
