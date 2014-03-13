var
  https = require('https'),
  util = require('util'),
  _ = require('./util');

var Client = module.exports.Client = function (key) {
  var self = this;

  if (!_.isString(key)) {
    throw new Error('key must be a String');
  }

  self._accessKey = key;
  self._url       = 'api.clockworksms.com';
  self._basePath  = '/http/send.aspx';
}

/**
 * Send a sms and invokes the callback with the response.
 *
 * @param   {Object}    options 
 * @param   {Function}  callback
 * @return  {Client}
 */

 Client.prototype.send = function (options, callback) {
  var self = this;

  if (!_.instanceOf(callback, Function)) {
    throw new Error('callback must be a Function');
  }

  if (!_.isObject(options)) {
    throw new Error('options must be an Object');
  }

  if (options.to == 'undefined') {
    throw new Error('Properties "to" has to be defined');	
  } 
  else if (_.isArray(options.to)) {
    var _to = options.to.join();
  }
  else {
  	var _to = options.to;
  }

  if (options.msg == 'undefined' || !_.isString(options.msg)) {
    throw new Error('Properties MSG has to be defined and a String');	
  }

  _path = self._basePath + '?key=' + self._accessKey + '&to=' + _to + '&content=' + encodeURIComponent(options.msg);
  
  if (options.from !== 'undefined' && _.isString(options.from)) {
  	_path += '&from=' + encodeURIComponent(options.from);
  }

  if (options.long !== 'undefined' && _.isBoolean(options.long)) {
  	if (options.long == true) {
      _path += '&long=1';
    }
  }
    
  var _request = {
    hostname: self._url,
    path: _path,
    method: 'GET'
  };

  var req = https.request(_request, function(res) {
    res.data = '';

    res.on('data', function(chunk) {
     res.data += chunk;
    });
    
    res.on('end', function() {
     var response;

      try {
        response = new Response(res);
      } catch (e) {
       callback(e);
      }

      if (response) {
        callback(response);
      }
    });

  });

  req.end();

  req.on('error', function(e) {
    callback(new ResponseException('HttpRequestError',e));
  });
  return self;
}

/**
 * Returns a new clockworksms client.
 *
 * @return  {Client}
 */
var createClient = module.exports.createClient = function (key) {
  return new Client(key);
}

/**
 * A clockworksms response.
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {

  var self = this;
  self.messageIds = [];
  var errorMsg = "";

  if (response.statusCode != 200) {
    throw new ResponseException('RESTFullError','Response error from ' + self._url +  ' with code '+ response.statusCode);
  }


  var resData = response.data.split("\n");

  for(var i=0; i < resData.length; i++) {
    responseLine = resData[i];
    if(responseLine.length <= 1) continue;
    if(responseLine.substring(0,5) == 'Error') {
    	throw new ResponseException('AccError',responseLine);
    }
    else if(_.has(responseLine.split(" "),'Error')) {
      errorMsg += responseLine + " ";
    }
    else {
      self.messageIds.push({
        to: responseLine.split(" ")[1].trim(),
        id: responseLine.split("ID:")[1].trim()
      })
    }
  }
  if(errorMsg != "") {
    throw new ResponseException('SmsError',errorMsg);
  } else {
    if (self.messageIds.length == 1) {
      self.messageIds = self.messageIds[0];
    }
  }

}

/**
 * A generic exception.
 *
 * @param   {String}  code
 * @param   {String}  message
 */
var ResponseException = module.exports.ResponseException = function(code, message) {
  Error.call(this, message);

  var self      = this;
  self.message  = message;
  self.code     = code;
}

util.inherits(ResponseException, Error);
