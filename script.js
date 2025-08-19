body {
  margin: 0;
  font-family: Arial, sans-serif;
  display: flex;
  height: 100vh;
  background-color: #f4f4f4;
}

.sidebar {
  width: 250px;
  background: #333;
  color: white;
  padding: 1rem;
  overflow-y: auto;
}

.sidebar h2, .sidebar h3 {
  margin: 0 0 10px 0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #444;
}

.sidebar li:hover, .sidebar li.active {
  background: #555;
}

.main {
  flex-grow: 1;
  padding: 2rem;
  background: #fff;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#saveBtn {
  background: #4CAF50;
  border: none;
  color: white;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

#saveBtn:hover {
  background: #45a049;
}

h1 {
  margin: 0;
}

ul#checklist {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}

#checklist li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.2);
}

#notesContainer {
  margin-top: 20px;
}

#notes {
  width: 100%;
  font-size: 1rem;
  padding: 8px;
  resize: vertical;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-family: Arial, sans-serif;
}
