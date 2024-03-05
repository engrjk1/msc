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

//parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str);
        return obj;
    }catch(e){
        return{};
    };
}

//crate a string of random alphnumeric characters, of a given lenght

helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength >0 ? strLength : false;
    if(strLength){
        if(strLength){
            var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            //start the final string

            var str = '';
            for(i = 1; i<= strLength; i++){
                //get a random character from the possibleCharacters string
                var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

                //Append this character to the final string
                str+=randomCharacter;
            }
            return str;
        }
    }else{
        return false;
    }
}

//Export
module.exports = helpers;