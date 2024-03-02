//helpers for various tasks
var crypto = require('crypto');
var config = require('./config');

//container for the helpers
var helpers = {};
//create a sha256 hash
helpers.hash = function(str){
    if(typeof(str)=='string' && str.length > 0) {
        var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
};

//parse a JSON string to an object in all cases, withou thorwing
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str);
        return obj;
    }catch(e){
        return {};
    }
}



//Export
module.exports = helpers;