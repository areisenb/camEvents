'use strict';

const fs = require('fs').promises;
var log = require('log4js').getLogger ("events");
var ev = require('../utils/event');

/**
 * gets the events
 * gets the events
 *
 * returns List
 **/
exports.getEvents = function() {
  return new Promise(function(resolve, reject) {
    fs.readdir ('./events', {withFileTypes: true}).
      then (dirEntries => {
        let events = [];
        let waitListings = 0;
        for (let dirEnt of dirEntries) {
          if (dirEnt.isDirectory()) {
            let event = ev.analyseEvent (dirEnt);
            if (event.date && (event.date.length > 0)) {
              event.media = [];
              event.file = []
              event.date = event.date.replace ('_', ':');
              waitListings++;
              fs.readdir('./events/' + dirEnt.name, {withFileTypes: true}).
                then (evtEntries => {
                  for (let evtEnt of evtEntries) {
                    if (evtEnt.isFile ()) {
                      event.media.push (evtEnt.name);
                      event.file.push (`${dirEnt.name}/${evtEnt.name}`);
                    }
                  }
                  if (event.media.length > 0)
                    events.push(event);
                  if (--waitListings == 0) {
                    resolve (events);
                  }
                }).
                catch (err => {
                  log.error (err);
                  if (--waitListings == 0) {
                    resolve (events);
                  }                  
                });
            } else {
              log.warn ("no valid event entry: " + dirEnt.name);
            }
          }
        }
        if (waitListings == 0)
          resolve (events);
      }).
      catch (err => {
        log.error (err);
        reject (err);
      })
  });
}

module.exports.getEvent = function getEvent (req, res, next) {
  if (!(req.params.eventId)) {
    res.status(400).send('missing eventId parameter');
  }
  fs.readdir('./events/' + req.params.eventId, {withFileTypes: true}).
  then (evtEntries => {
    let event = [];
    for (let evtEnt of evtEntries) {
      if (evtEnt.isFile ()) {
        event.push ( {media:evtEnt.name, file: `/web/camEvents/media/${req.params.eventId}/${evtEnt.name}`} );
      }
    }
    res.json(event);
  }).
  catch (err => {
    log.error (err);
    res.status(400).send(err);                
  });
}
