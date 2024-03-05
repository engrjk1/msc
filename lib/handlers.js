/*
*
*Request Handlers
*/

var _data = require('./data');
var helpers = require('./helpers');
const { hash } = require('./helpers');


//Define handlers
var handlers = {}

handlers.users = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)> -1){
        handlers._users[data.method](data,callback);
    }else{
        callback(405);
    }
};


//container for the users submethods
handlers._users = {};

//Users -post
//required data: fname,lname, phone, password, tosagreement
//optional data: none
handlers._users.post = function(data,callback){
    //check that all require fields are filled out

    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length>0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length>0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length>0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
    

    if(firstName && lastName && phone && password && tosAgreement){
        //make sure that user doesnot already exist 
        _data.read('users',phone,function(err,data){
            if(err){


                 var hashedPassword = helpers.hash(password);

                 if(hashedPassword){
                    //create the user object
                    var userObject ={
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword':hashedPassword,
                        'tosAgreement':true
                    };

                    _data.create('users',phone,userObject,function(err){
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500,{'Error':'Could not create the new user'});
                        }
                    })
                 }else{
                    callback(500,{'Error':'could not hash the user\'s passowrd'});
                 }
                 
            }else{
                callback(400,{'Error' : 'A user with that phone number already exists'});
            }
        })
    }else{
        callback(400, {'Erro': 'Missing required fields'});
    }
};

//Users -get
handlers._users.get = function(data,callback){
//check that the phone is valid
var phone = typeof(data.queryStringObject.phone) == 'string' &&  data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
if(phone){
    _data.read('users',phone,function(err,data){
        if(!err && data){
            delete data.hashedPassword;
            callback(200,data);
        }else{
            callback(404);
        }
    })
}else{
    callback(400,{'Error':'Missing required field'});
}
};


//Users -put
// Required data: phon
//Optional data: firstName, lastName, Password(at least one must be specified)
//@TODO only let the authenticated user update their own object
handlers._users.put = function(data,callback){


    //check that the phone is valid
    var phone = typeof(data.payload.phone) == 'string' &&  data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    //check for the optional fields
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length>0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length>0 ? data.payload.lastName.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length>0 ? data.payload.password.trim() : false;
    
    //Error if the phone is invalid
    if(phone){
        //Error if nothing is sent to update
        if(firstName || lastName || password){
            //lookup the user
            _data.read('users',phone,function(err,userData){
                if(!err && userData){
                    //update the fields necessary
                    if(firstName){
                        userData.firstName = firstName;
                    }
                    if(lastName){
                        userData.lastName = lastName;
                    }
                    if(password){
                        userData.hashedPassword = helpers.hash(password);
                    }

                    //Store the new udpate 
                    _data.update('users',phone,userData,function(err){
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500,{'Error':'Could not update the user'});
                        }
                    });
                    
                }else{
                    callback(400,{'Error':'The specified user does not exist'})
                }
            });

        }else{ 
            callback(400,{'Error':'Missing fields to update'});
        }

    }else{
        callback(400,{'Error':'Missing required fields'});
    }

};
//Users -delete
handlers._users.delete = function(data,callback){

};
//ping handler
handlers.ping = function(data,callback){
    //callback a http status code, and a payload object
    callback(200,{});
};

//Not found handler
handlers.notFound = function(data,callback){
    callback(404,{});
};


module.exports = handlers 


