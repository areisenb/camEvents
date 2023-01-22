'use strict';


exports.composeEvtName = function(event) {
  let date = new Date;
  return event + '@' + date.toISOString().replace (/([0-9]{2})\.[0-9]{3}Z/, "$1Z").replace(/:/g, '_');
}

exports.analyseEvent = function(eventName) {
  let split = eventName.name.split('@');
  let name = split[0];
  let date = split[1];
  if (date && date.length >= 0) {
    return ({ id: eventName.name, name: name, date: date.replace(/_/g, ':')});
  } else return undefined;
}
