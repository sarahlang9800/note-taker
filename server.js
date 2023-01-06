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
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public', 'notes.html')));

// GET route for homepage
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public', 'index.html')));

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        res.json(JSON.parse(data));
    });
});

// Post notes 
app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    let notelength = (noteList.length).toString();

    newNote.id = notelength;
    noteList.push(newNote);

    fs.writeFileSync('./db/db.json', JSON.stringify(noteList));
    res.json(noteList);
});

// Deletes note by selected ID 
app.delete('/api/notes/:id', (request, result) => {
    let noteName = request.params.id;
    
    fs.readFile('./db/db.json', 'utf-8', (err, response) => {
        if (err) throw (err);
        const everyNote = JSON.parse(response);
        const newNotes = everyNote.filter(note => note.id != noteName);
        fs.writeFile('./db/db.json', JSON.stringify(newNotes, null, 2),
            err => {
                if (err) throw err;
                result.json(true);
            }
        );
      });
    });
    
app.listen(PORT);