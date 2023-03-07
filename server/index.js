const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const mysql = require('mysql2')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'cruddatabase',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/get', (req, res) => {
    const sqlSelect = "SELECT * FROM bands";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});

app.post('/api/insert', (req, res) => {
    const bandName = req.body.bandName;
    const genre = req.body.genre;
    const sqlCheck = "SELECT * FROM bands WHERE bandName = ?";
    const sqlInsert = "INSERT INTO bands (bandName, genre) VALUES (?, ?)";
  
    db.query(sqlCheck, [bandName], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error checking for existing band");
      } else if (result.length > 0) {
        res.status(400).send("Band already exists");
      } else {
        db.query(sqlInsert, [bandName, genre], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error inserting new band");
          } else {
            res.send("Band inserted successfully");
          }
        });
      }
    });
  });
  

app.delete('/api/delete', (req, res) => {
    const name = req.query.bandName;
    const sqlDelete = "DELETE FROM bands WHERE bandName = ?";

    db.query(sqlDelete, [name], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error deleting band");
        } else {
            res.send("Band deleted successfully");
        }
    });
});

app.put('/api/update', (req, res) => {
    const name = req.body.bandName;
    const genre = req.body.genre;

    const sqlUpdate = "UPDATE bands SET genre = ? WHERE bandName = ?";

    db.query(sqlUpdate, [genre, name], (err, result) => {
        if (err) console.log(err);
    });
});

app.listen(3001, () => {
    console.log('running on port 3001')
});