import React, { useState, useEffect } from 'react';
import { CheckCircle,  Calendar, PlusCircle, Trash2, CheckSquare, Edit } from 'lucide-react';
import './index.css';

function ToDoList() {
    const [defaultList, setDefaultList] = useState([]);
    const [allAssignments, setAllAssignments] = useState(defaultList);
    const [Status, setStatus] = useState('Pending');
    const [assignment, setAssignment] = useState('');
    const [Date, setDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [updateDetails, setUpdateDetails] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:5000/todoList/getall");
            if (response.ok) {
                const data = await response.json();
                console.log("Tasks Fetched Successfully", data);
                setDefaultList(data.data || []);
            } else {
                console.log("Tasks Fetching Failed");
            }
        } catch (error) {
            console.log("Error occurred while fetching Tasks", error);
        }
    };

    useEffect(() => {
        handleFilter();
    }, [filterStatus, defaultList]);

    useEffect(() => {
        const timer = setTimeout(() => setUpdateDetails(""), 2000);
        return () => clearTimeout(timer);
    }, [updateDetails]);

    const handleAdd = async () => {
        if (!assignment || !Date) {
            setUpdateDetails("Fill all the Details");
        } else {
            try {
                const response = await fetch("http://localhost:5000/todoList/createNew", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ assignment: assignment, Date: Date, Status: Status }),
                });
                if (response.ok) {
                    console.log("Task Created Successfully");
                } else {
                    console.log("Task not Created");
                }
            } catch (error) {
                console.log("Error Occurred while creating Task");
                console.log(error);
            }
            setFilterStatus("All");
            fetchTasks(); 
            setUpdateDetails(assignment + " Added Successfully");
            setAssignment("");
            setDate("");
            setStatus("Pending");
        }
    };

    const handleFilter = () => {
        let filteredAssignments = defaultList;

        if (filterStatus !== "All") {
            filteredAssignments = filteredAssignments.filter(assign => assign.Status === filterStatus);
        }
        setAllAssignments(filteredAssignments);
    };

    const handleRemove = async (assignmen) => {
        try {
            const response = await fetch("http://localhost:5000/todoList/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ assignment: assignmen.assignment }),
            });

            if (response.ok) {
                console.log("Assignment Deleted Successfully");
                const updatedDefaultList = defaultList.filter(
                    (assign) => assign.assignment !== assignmen.assignment
                );
                setDefaultList(updatedDefaultList);
                setUpdateDetails(assignmen.assignment + " Removed Successfully");
            } else {
                console.log("Assignment not Deleted");
                setUpdateDetails("Failed to delete task");
            }
        } catch (error) {
            console.log("Error in deleting Assignment ", error);
            setUpdateDetails("Error deleting task");
        }
    };

    const handleUpdateStatus = async (assignmen) => {
        try {
            const response = await fetch(`http://localhost:5000/todoList/update/${assignmen.assignment}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Status: "Completed" }),
            });
            if (response.ok) {
                console.log("Assignment updated Successfully");
                const updatedDefaultList = defaultList.map((assign) =>
                    assign.assignment === assignmen.assignment
                        ? { ...assign, Status: "Completed" }
                        : assign
                );
                setDefaultList(updatedDefaultList);
                setUpdateDetails(assignmen.assignment + " status updated successfully");
            } else {
                console.log("Assignment not Updated");
                setUpdateDetails("Failed to update status");
            }
        } catch (error) {
            console.log("Error occurred while updating Assignment ", error);
            setUpdateDetails("Error updating status");
        }
    };

    const getStatusColor = (Status) => {
        return Status === "Completed" ? "text-green-600" : "text-amber-600";
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Task Manager</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1">
                    <span className="text-gray-700 font-medium">Status:</span>
                    <select
                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => { setFilterStatus(e.target.value); }}
                        value={filterStatus}
                    >
                        <option>All</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                    <CheckSquare className="mr-2" size={20} />Tasks
                </h2>
                {allAssignments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No tasks found. Add a new task below!</p>
                ) : (
                    <ul className="space-y-3">
                        {allAssignments.map((assign, index) => (
                            <li
                                key={index}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg ${assign.Status === "Completed" ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}
                            >
                                <div className="flex-1 mb-2 sm:mb-0">
                                    <div className="flex items-center">
                                        {assign.Status === "Completed" ? (
                                            <CheckCircle className="text-green-500 mr-2" size={18} />
                                        ) : (
                                            <Edit className="text-amber-500 mr-2" size={18} />
                                        )}
                                        <span
                                            className={`font-medium ${assign.Status === "Completed" ? "line-through text-gray-500" : "text-gray-700"}`}
                                        >
                                            {assign.assignment}
                                        </span>
                                    </div>
                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                        <Calendar className="mr-1" size={14} />
                                        {assign.Date}
                                        <span className={`ml-3 font-medium ${getStatusColor(assign.Status)}`}>
                                            {assign.Status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleRemove(assign)}
                                        className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                                        title="Remove task"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(assign)}
                                        disabled={assign.Status === "Completed"}
                                        className={`p-1 focus:outline-none ${assign.Status === "Completed" ? "text-gray-400 cursor-not-allowed" : "text-green-500 hover:text-green-700"}`}
                                        title="Mark as completed"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                    <PlusCircle className="mr-2" size={20} />Add New Task
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Enter Task Name"
                        value={assignment}
                        onChange={(e) => setAssignment(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        placeholder="Enter the End Date"
                        value={Date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={Status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Pending</option>
                        <option>Completed</option>
                    </select>
                </div>
                <button
                    onClick={handleAdd}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                >
                    <PlusCircle className="mr-2" size={18} />
                    Add Task
                </button>
            </div>

            {updateDetails && (
                <div
                    className={`mt-4 p-3 rounded-md ${updateDetails.includes("Added") || updateDetails.includes("updated") ? "bg-green-100 text-green-700" : updateDetails.includes("Removed") ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                >
                    {updateDetails}
                </div>
            )}
        </div>
    );
}

export default ToDoList;