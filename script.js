let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

const listElement = document.getElementById("taskList");
const statusText = document.getElementById("status");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    statusText.innerText = `Heard: "${transcript}"`;

    if (transcript.startsWith("add")) {
        const taskText = transcript.replace("add", "").trim();
        if (taskText) addTask(taskText);
    } else if (transcript.startsWith("delete task")) {
        const num = parseInt(transcript.split(" ")[2]) - 1;
        if (!isNaN(num)) deleteTask(num);
    } else if (transcript.startsWith("mark task")) {
        const num = parseInt(transcript.split(" ")[2]) - 1;
        if (!isNaN(num)) markTaskDone(num);
    }
};

function addTask(task) {
    taskList.push({ text: task, done: false });
    saveAndRender();
}

function deleteTask(index) {
    if (taskList[index]) {
        taskList.splice(index, 1);
        saveAndRender();
    }
}

function markTaskDone(index) {
    if (taskList[index]) {
        taskList[index].done = true;
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTasks();
}

function renderTasks() {
    listElement.innerHTML = "";
    taskList.forEach((task, idx) => {
        const li = document.createElement("li");
        li.innerText = `${idx + 1}. ${task.text} ${task.done ? "✅" : ""}`;

        // delete button
        const delBtn = document.createElement("button");
        delBtn.innerText = "❌";
        delBtn.style.marginLeft = "10px";
        delBtn.style.backgroundColor = "#444";
        delBtn.style.color = "#e9c430";
        delBtn.style.border = "none";
        delBtn.style.cursor = "pointer";
        delBtn.onclick = () => deleteTask(idx);

        li.appendChild(delBtn);
        listElement.appendChild(li);
    });
}

function startVoice() {
    statusText.innerText = "Listening...";
    recognition.start();
}

document.getElementById("startbtn").addEventListener("click", startVoice);

// initial render
renderTasks();
