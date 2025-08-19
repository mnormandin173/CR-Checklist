const rooms = [
  "Creative Dev Studio", "Hasbro Brand", "Twister", "Monopoly", "Sorry!", "Clue", "Megatron", "Magic",
  "Tonka Truck", "Chance", "Piggy Bank", "University of Play", "Dugout", "HTO Command Center",
  "Peppa Pig", "Mr. Potato Head", "Fun Factory", "Playskool Meet'n Room", "Tinker Tank", 
  "Muddy Puddles", "Candy Land", "Jenga Den"
];

const checklistItems = ["Office supplies", "Technology"];

const roomList = document.getElementById('roomList');
const checklist = document.getElementById('checklist');
const roomTitle = document.getElementById('roomTitle');
const notesContainer = document.getElementById('notesContainer');
const notesInput = document.getElementById('notes');
const saveBtn = document.getElementById('saveBtn');
const todayDateDisplay = document.getElementById('todayDate');

let currentRoom = null;

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function getTodayData() {
  const today = getTodayDate();
  return JSON.parse(localStorage.getItem(today)) || {};
}

function saveTodayData(data) {
  const today = getTodayDate();
  localStorage.setItem(today, JSON.stringify(data));
}

function saveRoomData(roomKey, tasks, notes) {
  const todayData = getTodayData();
  todayData[roomKey] = { tasks, notes };
  saveTodayData(todayData);
}

function loadRoom(roomName) {
  currentRoom = roomName;
  const roomKey = roomName.replace(/\s+/g, '_');
  const todayData = getTodayData();

  document.querySelectorAll('#roomList li').forEach(li => {
    li.classList.toggle('active', li.textContent === roomName);
  });

  roomTitle.textContent = roomName;

  const savedRoom = todayData[roomKey] || { tasks: {}, notes: "" };
  checklist.innerHTML = '';

  checklistItems.forEach((item, index) => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${index}`;
    checkbox.checked = savedRoom.tasks[index] || false;

    checkbox.addEventListener('change', () => {
      savedRoom.tasks[index] = checkbox.checked;
      saveRoomData(roomKey, savedRoom.tasks, notesInput.value);
    });

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = item;

    li.appendChild(checkbox);
    li.appendChild(label);
    checklist.appendChild(li);
  });

  notesContainer.style.display = 'block';
  notesInput.value = savedRoom.notes;

  notesInput.oninput = () => {
    saveRoomData(roomKey, savedRoom.tasks, notesInput.value);
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

// Mobile-friendly CSV export
saveBtn.addEventListener('click', () => {
  const today = getTodayDate();
  const data = getTodayData();

  let csv = ['Room Name', ...checklistItems, 'Notes'].join(',') + '\n';

  rooms.forEach(room => {
    const roomKey = room.replace(/\s+/g, '_');
    const roomData = data[roomKey] || { tasks: {}, notes: '' };
    const row = [
      `"${room}"`,
      ...checklistItems.map((_, idx) => roomData.tasks[idx] ? 'X' : ' '),
      `"${roomData.notes.replace(/"/g,'""')}"`
    ];
    csv += row.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${today}_checklist.csv`;
  link.click();
});

// Show today's date at top of sidebar
todayDateDisplay.textContent = getTodayDate();

// Build room list
setupRoomList();
