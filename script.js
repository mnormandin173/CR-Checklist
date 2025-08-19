const rooms = [
  "Creative Dev Studio", "Hasbro Brand", "Twister", "Monopoly", "Sorry!", "Clue", "Megatron", "Magic",
  "Tonka Truck", "Chance", "Piggy Bank", "University of Play", "Dugout", "HTO Command Center",
  "Peppa Pig", "Mr. Potato Head", "Fun Factory", "Playskool Meet'n Room", "Tinker Tank", 
  "Muddy Puddles", "Candy Land", "Jenga Den"
];

// Checklist items (only two checkboxes)
const checklistItems = [
  "Office supplies",
  "Technology"
];

const roomList = document.getElementById('roomList');
const checklist = document.getElementById('checklist');
const roomTitle = document.getElementById('roomTitle');
const notesContainer = document.getElementById('notesContainer');
const notesInput = document.getElementById('notes');

let currentRoom = null;

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function resetIfNewDay(roomKey) {
  const lastDate = localStorage.getItem(`${roomKey}_date`);
  const today = getTodayDate();
  if (lastDate !== today) {
    localStorage.setItem(`${roomKey}_date`, today);
    localStorage.removeItem(`${roomKey}_tasks`);
    localStorage.removeItem(`${roomKey}_notes`);
  }
}

function saveTasks(roomKey, tasks) {
  localStorage.setItem(`${roomKey}_tasks`, JSON.stringify(tasks));
}

function saveNotes(roomKey, notes) {
  localStorage.setItem(`${roomKey}_notes`, notes);
}

function loadRoom(roomName) {
  currentRoom = roomName;
  const roomKey = roomName.replace(/\s+/g, '_');

  // Highlight active room
  document.querySelectorAll('#roomList li').forEach(li => {
    li.classList.toggle('active', li.textContent === roomName);
  });

  resetIfNewDay(roomKey);
  roomTitle.textContent = roomName;

  // Load saved checklist state
  const savedTasks = JSON.parse(localStorage.getItem(`${roomKey}_tasks`)) || {};
  checklist.innerHTML = '';

  checklistItems.forEach((item, index) => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${index}`;
    checkbox.checked = savedTasks[index] || false;

    checkbox.addEventListener('change', () => {
      savedTasks[index] = checkbox.checked;
      saveTasks(roomKey, savedTasks);
    });

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = item;

    li.appendChild(checkbox);
    li.appendChild(label);
    checklist.appendChild(li);
  });

  // Show notes field
  notesContainer.style.display = 'block';
  const savedNotes = localStorage.getItem(`${roomKey}_notes`) || '';
  notesInput.value = savedNotes;

  notesInput.oninput = () => {
    saveNotes(roomKey, notesInput.value);
  };
}

function setupRoomList() {
  rooms.forEach(room => {
    const li = document.createElement('li');
    li.textContent = room;
    li.addEventListener('click', () => loadRoom(room));
    roomList.appendChild(li);
  });
}

setupRoomList();
