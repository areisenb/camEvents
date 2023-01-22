var log4js = require('log4js');
log4js.configure({
  appenders: { 'out': { type: 'stdout' } },
  categories: { default: { appenders: ['out'], level: 'info' } }
});

var express = require('express');
var config = require('./config');
const serveStatic = require ('serve-static');

const media = require('./controllers/Media');
const events = require('./controllers/Events');

var log = log4js.getLogger ("camEvents");

const basePath = "/api/camEvents"

var app = express();
  
app.get(basePath + '/media/:eventId/upload', function (req, res, next) {
  return (media.uploadMediaFileForm (req, res, next));
});
app.post(basePath + '/media/:eventId/upload', function (req, res, next) {
  return (media.uploadMediaFile (req, res, next));
});


app.get(basePath + '/events/:eventId', function (req, res, next) {
  return (events.getEvent (req, res, next));
});
app.get(basePath + '/events', function (req, res, next) {
  events.getEvents()
    .then(function (response) {
      res.json (response);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
});

app.use("/web/camEvents/media", serveStatic('events', { index: false }));
app.use("/web/camEvents", serveStatic('client', {index: false}));

app.listen(config.config.port, function () {
    log.error('Camera Events backend is running on port ' + config.config.port);
});