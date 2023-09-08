const getAllTasks = (req, res) => {
    res.send("all tasks");
};

const createTask = (req, res) => {
    res.json(req.body);
};

const getTask = (req, res) => {
    res.send("single tasks");
};

const updateTask = (req, res) => {
    res.send("update tasks");
};

const deleteTask = (req, res) => {
    res.send("delete tasks");
};

module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
};
