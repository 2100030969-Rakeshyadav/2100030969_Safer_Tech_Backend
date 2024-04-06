const http = require('http');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`[${new Date()}] ${req.method} ${req.url}`);
    next();
});

app.post('/createFile', (req, res) => {
    const { filename, content } = req.body;
    fs.writeFile(filename, content, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing file');
        }
        console.log(`File ${filename} created`);
        res.status(200).send('File created successfully');
    });
});

// Endpoint for getting list of files
app.get('/getFiles', (req, res) => {
    fs.readdir('.', (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading directory');
        }
        res.json(files);
    });
});

app.get('/getFile/:filename', (req, res) => {
    const filename = req.params.filename;
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).send('File not found');
        }
        res.send(data);
    });
});

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
