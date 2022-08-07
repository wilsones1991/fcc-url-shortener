require('dotenv').config({path: 'sample.env'});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns')
const app = express();


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const urlModel = require('./url');
const { json } = require('body-parser');
let urlNumber = 1

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  
  const shortUrl = Number(req.params.shortUrl)

  if (shortUrl && shortUrl > 0) {
    urlModel.findOne({short_url: shortUrl})
    .then((doc) => {
      res.redirect(doc.url)
    })
    .catch((err) => {return err})
  }
  
})

app.post('/api/shorturl', (req, res) => {
  
  const urlObject = new URL(req.body.url)

  dns.lookup(urlObject.hostname, (err, host) => {
    
    if (err) {
      console.log(err)
      res.json({error: 'invalid url'})
      return
    }

    let url = new urlModel({
      url: req.body.url,
      short_url: urlNumber
    })
  
    url.save()
      .then(doc => {
        console.log("Doc: " + doc)
      })
      .catch(err => console.log(err))
      
    res.json({ original_url: req.body.url, short_url: urlNumber})
  
    urlNumber++

  })
  
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
