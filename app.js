// Set environment variable
const dotenv = require('dotenv');
dotenv.config();
//--------

// Require Express et set an instance
const express = require('express');
const app = express();
//--------

// Static files
app.use(express.static('public'));
//--------

// Module to parse sent form data 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
//--------

// Module to allow others domains to communicate with this server
const cors = require('cors');
app.use(cors());
//--------

// Modules for security
const helmet = require('helmet');
app.use(helmet.hidePoweredBy({setTo: 'PHP 4.2.0'}));
const noCache = require('nocache');
app.use(noCache());
//--------

// Require Mongoose and connect to remote database server
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});
//--------

// Get notification if connection is successfull or if a connection error occurs
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log("We're connected!")); 
//--------

// Set database schema and model
// 1- Set the schema
const BookSchema = new mongoose.Schema({
  'title': String,
  'comments': [String]
});
// 2- Compile schema into model
const Book = mongoose.model('Book', BookSchema);
//--------

// Set routes

app.get('/', (req, res) => res.send("/public/index.html"));

app.post('/api/books', (req, res) => {
  let title = req.body.title;
  Book.find({'title': title}, (err, doc) => {
    if (err) res.send('title already exists');
    else {
      let book = new BookSchema({'title': title, 'comments': []});
      book.save((err, book) => {
        if (err) console.log(err);
        else res.json(book);
      });
    }
  });
});

app.post('/api/books/:id', (req, res) => {
  let id = req.params.id;
  Book.findById(id, (err, book) => {
    if (err) res.send('no book exists');
    else {
      let comment = req.body.comment;
      book['comments'].push(comment);
      book.save((err, book) => {
        if (err) console.log(err);
        else res.json(book);
      });
    }
  });
});

app.get('/api/books', (req, res) => {
  Book.find({}, (err, books) => {
    if (err) console.log(err);
    else {
      let arr = books.map(book => { return {'_id': book['_id'] ,'title': book['title'], 'commentcount': book['comments'].length}});
      res.json(arr);
    }
  });
});

app.get('/api/books/:id', (req, res) => {
  let id = req.params.id;
  Book.findById(id, (err, book) => {
    if (err) res.send('no book exists');
    else res.json(book);
  });
});

app.delete('/api/books', (req, res) => {
  Book.deleteMany({}, err => {
    if (err) console.log(err);
    else res.send('complete delete successful');
  });
});

app.delete('/api/books/:id', (req, res) => {
  let id = req.params.id;
  Book.findByIdAndDelete(id, err => {
    if (err) res.send('no book exists');
    else res.send('delete successful');
  });
});

app.use((err, req, res, next) => res.status(500).send('Something broke!'));

app.use((req, res, next) => res.status(404).send('Sorry cant find that!'));

app.listen(3000);



