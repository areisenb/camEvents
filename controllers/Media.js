'use strict';

var log = require('log4js').getLogger ("media");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
const config = require('../config');
var ev = require('../utils/event');

module.exports.uploadMediaFileForm = function uploadMediaFileForm (req, res, next) {
  if ('eventId' in req.params) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="upload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload" multiple> <br>');
    res.write(`<input type="event" name="eventId" value=${req.params['eventId']}><br>`);  
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  } else 
    return res.status(400).send('mandatory eventId missing');  
}

module.exports.uploadMediaFile = function uploadMediaFile (req, res, next) {
    var busboy =  Busboy({ headers: req.headers });
    if ( !('eventId' in req.params) ) {
      res.status(400).send('missing eventId as mandatory parameter');
      return;
    }
    let event = ev.composeEvtName (req.params['eventId']);
    let saveTo = path.join('.', config.config.uploadFolder + '/' + event );
    if (!(fs.existsSync(saveTo))) {
      fs.mkdirSync(saveTo, {recursive: true});
    }

    busboy.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      log.info (`Uploading file '${saveTo}/${filename}' for event: ${event} with mime: ${mimeType}`);
      if (mimeType != 'image/jpeg') {
        res.status(400).send('only jpeg images allowed for upload');
        return;
      }

      if ((filename.indexOf ('/') >= 0) || (filename.indexOf ('\\') >= 0)) {
        res.status(400).send('filename may not contain any / or \\ character');
      }

      file.pipe(fs.createWriteStream(saveTo + '/' + filename));
    });
  
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("Upload completed");
    });
  
    return req.pipe(busboy);    
}

