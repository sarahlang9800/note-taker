const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware for parsing json
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET route for notes page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './db', 'db.json')));

// GET route for homepage
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public', 'notes.html')));

app.get('./api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        res.json(JSON.parse(data))
    })
})

app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
    let notelength = (noteList.length).toString();

    newNote.id = notelength;
    noteList.push(newNote);

    fs.writeFileSync('./db.json', JSON.stringify(noteList));
    res.json(noteList);
})

app.listen(PORT);