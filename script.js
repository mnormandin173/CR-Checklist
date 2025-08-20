const rooms = [
  "Creative Dev Studio", "Hasbro Brand", "Twister", "Monopoly", "Sorry!", "Clue", "Megatron", "Magic",
  "Tonka Truck", "Chance", "Piggy Bank", "University of Play", "Dugout", "HTO Command Center",
  "Peppa Pig", "Mr. Potato Head", "Fun Factory", "Playskool Meet'n Room", "Tinker Tank", 
  "Muddy Puddles", "Candy Land", "Jenga Den"
];

const checklistItems = [
  "Office supplies",
  "Technology"
];

const roomList = document.getElementById('roomList');
const checklist = document.getElementById('checklist');
const roomTitle = document.getElementById('roomTitle');
const notesContainer = document.getElementById('notesContainer');
const notesInput = document.getElementById('notes');
const saveBtn = document.getElementById('saveBtn');
const addRoomBtn = document.getElementById('addRoomBtn');
const deleteRoomBtn = document.getElementById('deleteRoomBtn');

let currentRoom = null;

function getTodayDate() {
  const today = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  return today.toLocaleDateString(undefined, options);
}

function resetIfNewDay(roomKey) {
  const lastDate = localStorage.getItem(`${roomKey}_date`);
  const today = new Date().toISOString().split('T')[0];
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

  document.querySelectorAll('#roomList li').forEach(li => {
    li.classList.toggle('active', li.textContent === roomName);
  });

  resetIfNewDay(roomKey);
  roomTitle.textContent = roomName;

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

  notesContainer.style.display = 'block';
  const savedNotes = localStorage.getItem(`${roomKey}_notes`) || '';
  notesInput.value = savedNotes;

  notesInput.oninput = () => {
    saveNotes(roomKey, notesInput.value);
  };
}

function setupRoomList() {
  const dateLi = document.createElement('li');
  dateLi.textContent = getTodayDate();
  dateLi.style.fontWeight = "bold";
  dateLi.style.textAlign = "center";
  roomList.appendChild(dateLi);

  rooms.forEach(room => {
    const li = document.createElement('li');
    li.textContent = room;
    li.addEventListener('click', () => loadRoom(room));
    roomList.appendChild(li);
  });
}

function exportToExcel() {
  const today = new Date().toISOString().split('T')[0];
  const data = [];

  const header = ["Room", ...checklistItems, "Notes"];
  data.push(header);

  rooms.forEach(room => {
    const roomKey = room.replace(/\s+/g, '_');
    const savedTasks = JSON.parse(localStorage.getItem(`${roomKey}_tasks`)) || {};
    const savedNotes = localStorage.getItem(`${roomKey}_notes`) || "";

    const row = [room];
    checklistItems.forEach((_, index) => {
      row.push(savedTasks[index] ? "✅" : ""); // leave blank if unchecked
    });
    row.push(savedNotes);

    data.push(row);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Checklist");

  XLSX.writeFile(wb, `Checklist_${today}.xlsx`);
}

saveBtn.addEventListener('click', exportToExcel);

addRoomBtn.addEventListener('click', () => {
  const newRoom = prompt("Enter new room name:");
  if (newRoom) {
    rooms.push(newRoom);
    const li = document.createElement('li');
    li.textContent = newRoom;
    li.addEventListener('click', () => loadRoom(newRoom));
    roomList.appendChild(li);
  }
});

deleteRoomBtn.addEventListener('click', () => {
  if (!currentRoom) return alert("Select a room to delete");
  const index = rooms.indexOf(currentRoom);
  if (index > -1) {
    rooms.splice(index, 1);
    document.querySelectorAll('#roomList li').forEach(li => {
      if (li.textContent === currentRoom) li.remove();
    });
    currentRoom = null;
    roomTitle.textContent = "Select a Room";
    checklist.innerHTML = '';
    notesContainer.style.display = 'none';
  }
});

setupRoomList();
