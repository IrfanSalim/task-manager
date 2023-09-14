const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");

// Load tasks from /api/tasks
const showTasks = async () => {
    loadingDOM.style.visibility = "visible";
    try {
        const {
            data: { tasks },
        } = await axios.get("/api/v1/tasks");
        if (tasks.length < 1) {
            tasksDOM.innerHTML =
                '<h5 class="empty-list">No tasks in your list</h5>';
            loadingDOM.style.visibility = "hidden";
            return;
        }
        const allTasks = tasks
            .map((task) => {
                const { completed, _id: taskID, name } = task;
                return `<div class="single-task ${
                    completed && "task-completed"
                }">
<h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
<div class="task-links">



<!-- edit link -->
<input type="checkbox" class="completed-check" id="${taskID}" name="completed" style="margin-right:10px">
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`;
            })
            .join("");
        tasksDOM.innerHTML = allTasks;
    } catch (error) {
        tasksDOM.innerHTML =
            '<h5 class="empty-list">There was an error, please try later....</h5>';
    }
    loadingDOM.style.visibility = "hidden";
    const completedCheck = document.querySelectorAll("input[type=checkbox]");
    completedCheck.forEach((check) => {
        if (!check.parentElement.parentElement.classList.contains("false")) {
            check.checked = true;
        }
        check.addEventListener("click", async function () {
            try {
                const _completed = this.checked;
                console.log(this.checked);
                const _taskID = this.id;
                this.parentElement.parentElement.className = `single-task ${
                    _completed && "task-completed"
                }`;
                await axios.patch(`/api/v1/tasks/${_taskID}`, {
                    completed: _completed,
                });
            } catch (error) {
                formAlertDOM.style.display = "block";
                formAlertDOM.innerHTML = `error, please try again`;
            }
        });
    });
};

showTasks();

// delete task /api/tasks/:id

tasksDOM.addEventListener("click", async (e) => {
    const el = e.target;
    if (el.parentElement.classList.contains("delete-btn")) {
        loadingDOM.style.visibility = "visible";
        const id = el.parentElement.dataset.id;
        try {
            await axios.delete(`/api/v1/tasks/${id}`);
            showTasks();
        } catch (error) {
            console.log(error);
        }
    }
    loadingDOM.style.visibility = "hidden";
});

// form

formDOM.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = taskInputDOM.value;

    try {
        await axios.post("/api/v1/tasks", { name });
        showTasks();
        taskInputDOM.value = "";
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent = `success, task added`;
        formAlertDOM.classList.add("text-success");
    } catch (error) {
        formAlertDOM.style.display = "block";
        formAlertDOM.innerHTML = `error, please try again`;
    }
    setTimeout(() => {
        formAlertDOM.style.display = "none";
        formAlertDOM.classList.remove("text-success");
    }, 3000);
});
