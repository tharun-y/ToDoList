import ToDO from "../models/ToDoList.Model.js";

// Create a new task
export const createNewTask = async (req, res) => {
    const { assignment, Date, Status } = req.body;

    if (!assignment || !Date || !Status) {
        return res.status(400).json({ success: false, message: "Please fill out all fields" });
    }

    try {
        const newTask = new ToDO({ assignment, Date, Status });
        await newTask.save();
        return res.status(200).json({ success: true, message: "Task Created Successfully", data: newTask });
    } catch (error) {
        console.log("Error in Creating Task:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    const { assignment } = req.body;

    if (!assignment) {
        return res.status(400).json({ success: false, message: "Please provide the assignment to delete" });
    }

    try {
        const result = await ToDO.deleteOne({ assignment });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Task not Found" });
        }

        return res.status(200).json({ success: true, message: "Task deleted Successfully" });
    } catch (error) {
        console.log('Error in Deleting Task:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
    try {
        const allTasks = await ToDO.find();
        return res.status(200).json({ success: true, message: "All Tasks Fetched Successfully", data: allTasks });
    } catch (error) {
        console.log("Error while fetching all Tasks:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update task status to "Completed"
export const updateTasks = async (req, res) => {
    const { assignment } = req.params;  // Correct usage of route parameter

    if (!assignment) {
        return res.status(400).json({ success: false, message: "Assignment parameter missing" });
    }

    try {
        const updatedTask = await ToDO.findOneAndUpdate(
            { assignment },
            { Status: "Completed" },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not Found" });
        }

        return res.status(200).json({ success: true, message: "Task updated Successfully", data: updatedTask });
    } catch (error) {
        console.log("Error in Updating Task:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
