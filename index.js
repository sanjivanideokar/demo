const firebaseConfig = {
    apiKey: "AIzaSyCIFS36lldUFRam806tUDbryMBZyR8hYTI",
    authDomain: "todolist-2d12e.firebaseapp.com",
    projectId: "todolist-2d12e",
    storageBucket: "todolist-2d12e.appspot.com",
    messagingSenderId: "44752622577",
    appId: "1:44752622577:web:4519e2df7f17025d09ea50",
    measurementId: "G-KRD3095VE7"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const form = document.querySelector('#todo-form');
const list = document.querySelector('#todo-list');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('#todo-input');
    const taskName = input.value.trim();
    if (taskName) {
        db.collection('tasks').add({
            name: taskName,
            completed: false
        })
            .then(() => {
                input.value = '';
            })
            .catch((error) => {
                console.error('Error adding task:', error);
            });
    }
});

function createTaskItem(task) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
        db.collection('tasks').doc(task.id).update({
            completed: checkbox.checked
        })
            .catch((error) => {
                console.error('Error updating task:', error);
            });
    });
    const span = document.createElement('span');
    span.textContent = task.name;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        db.collection('tasks').doc(task.id).delete()
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
    });
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    return li;
}

function updateTaskItem(li, task) {
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.checked = task.completed;
    const span = li.querySelector('span');
    span.textContent = task.name;
}

function displayTasks(tasks) {
    list.innerHTML = '';
    tasks.forEach((task) => {
        const li = createTaskItem(task);
        list.appendChild(li);
    });
}

db.collection('tasks').orderBy('name').onSnapshot((snapshot) => {
    const tasks = [];
    snapshot.forEach((doc) => {
        const task = {
            id: doc.id,
            name: doc.data().name,
            completed: doc.data().completed
        };
        tasks.push(task);
    });
    displayTasks(tasks);
});