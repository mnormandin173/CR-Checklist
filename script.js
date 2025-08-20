let rooms = JSON.parse(localStorage.getItem("rooms")) || [
  "Creative Dev Studio", "Hasbro Brand", "Twister", "Monopoly", "Sorry!", "Clue", "Megatron", "Magic",
  "Tonka Truck", "Chance", "Piggy Bank", "University of Play", "Dugout", "HTO Command Center",
  "Peppa Pig", "Mr. Potato Head", "Fun Factory", "Playskool Meet'n Room", "Tinker Tank", 
  "Muddy Puddles", "Candy Land", "Jenga Den"
];

// Checklist items
const checklistItems = ["Office supplies", "Technology"];

const roomList = document.getElementById('roomList');
const checklist = document.getElementById('checklist');
const roomTitle = document.getElementById('roomTitle');
const notesContainer = document.getElementById('notesContainer');
const notesInput = document.getElementById('notes');
const todayDateEl = document.getElementById('todayDate');
const saveBtn = document.getElementById('saveBtn');

let currentRoom = null;

function getTodayFormatted() {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date().toLocaleDateString(undefined, options);
}

todayDateEl.textContent = getTodayFormatted();

function getTodayDateKey() {
  return new Date().toISOString().split("T")[0];
}

function resetIfNewDay(roomKey) {
  const lastDate = localStorage.getItem(`${roomKey}_date`);
  const today = getTodayDateKey();
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
  const roomKey = roomName.replace(/\s+/g, "_");

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
  roomList.innerHTML = '';
  rooms.forEach(room => {
    const li = document.createElement('li');
    li.textContent = room;
    li.addEventListener('click', () => loadRoom(room));
    roomList.appendChild(li);
  });
}

// ➕ Add room
document.getElementById("addRoomBtn").addEventListener("click", () => {
  const newRoom = prompt("Enter new room name:");
  if (newRoom && !rooms.includes(newRoom)) {
    rooms.push(newRoom);
    localStorage.setItem("rooms", JSON.stringify(rooms));
    setupRoomList();
  }
});

// ➖ Delete room
document.getElementById("deleteRoomBtn").addEventListener("click", () => {
  if (!currentRoom) {
    alert("Please select a room to delete.");
    return;
  }
  const confirmDelete = confirm(`Delete room "${currentRoom}"?`);
  if (confirmDelete) {
    rooms = rooms.filter(r => r !== currentRoom);
    localStorage.setItem("rooms", JSON.stringify(rooms));
    currentRoom = null;
    roomTitle.textContent = "Select a Room";
    checklist.innerHTML = "";
    notesContainer.style.display = "none";
    setupRoomList();
  }
});

// ✅ Export to Excel
saveBtn.addEventListener("click", () => {
  const wb = XLSX.utils.book_new();
  const ws_data = [["Room", ...checklistItems, "Notes"]];

  rooms.forEach(room => {
    const roomKey = room.replace(/\s+/g, "_");
    const savedTasks = JSON.parse(localStorage.getItem(`${roomKey}_tasks`)) || {};
    const savedNotes = localStorage.getItem(`${roomKey}_notes`) || "";

    const row = [room];
    checklistItems.forEach((_, i) => {
      row.push(savedTasks[i] ? "✅" : "❌");
    });
    row.push(savedNotes);
    ws_data.push(row);
  });

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Checklist");

  XLSX.writeFile(wb, `${getTodayDateKey()}_Checklist.xlsx`);
});

// ✅ Initialize
setupRoomList();
