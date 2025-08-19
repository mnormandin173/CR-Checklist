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

  // Highlight active room
  document.querySelectorAll('#roomList li').forEach(li => {
    li.classList.toggle('active', li.textContent === roomName);
  });

  // Display only the room name in header
  roomTitle.textContent = roomName;

  // Load saved checklist state
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

  // Notes
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

// Excel XML export with wrap text for notes and clean columns
saveBtn.addEventListener('click', () => {
  const today = getTodayDate();
  const data = getTodayData();

  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header"><Font ss:Bold="1"/></Style>
    <Style ss:ID="wrapText"><Alignment ss:WrapText="1"/></Style>
  </Styles>
  <Worksheet ss:Name="Checklist">
    <Table>
      <Column ss:Width="150"/>
      ${checklistItems.map(() => `<Column ss:Width="100"/>`).join('')}
      <Column ss:Width="250"/>`;

  // Header row
  xml += `<Row ss:StyleID="header">`;
  xml += `<Cell><Data ss:Type="String">Room Name</Data></Cell>`;
  checklistItems.forEach(item => {
    xml += `<Cell><Data ss:Type="String">${item}</Data></Cell>`;
  });
  xml += `<Cell><Data ss:Type="String">Notes</Data></Cell>`;
  xml += `</Row>`;

  // Data rows
  rooms.forEach(room => {
    const roomKey = room.replace(/\s+/g, '_');
    const roomData = data[roomKey] || { tasks: {}, notes: '' };

    xml += `<Row>`;
    xml += `<Cell><Data ss:Type="String">${room}</Data></Cell>`;
    checklistItems.forEach((_, idx) => {
      xml += `<Cell><Data ss:Type="String">${roomData.tasks[idx] ? '[X]' : '[ ]'}</Data></Cell>`;
    });
    xml += `<Cell ss:StyleID="wrapText"><Data ss:Type="String">${roomData.notes.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</Data></Cell>`;
    xml += `</Row>`;
  });

  xml += `</Table></Worksheet></Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${today}_checklist.xls`;
  link.click();
});

// Show today's date at top of sidebar
todayDateDisplay.textContent = getTodayDate();

// Build room list
setupRoomList();
