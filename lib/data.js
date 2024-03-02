/*
*library for storing ad edition data
*
*/

//dependencies

var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

//container for the module (to be exported)

var lib = {};

//base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

//write data to a file
lib.create = function(dir,file,data,callback){
    //open the file for writing 
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            //conver data to string 
            var stringData = JSON.stringify(data);

            //write to file and close it 

            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error closing new file');
                        }
                    });
                }else{
                    callback('Error writing to new file');
                }
            })
        } else {
            callback('Could not create new file, it may already exist');
        }
    });
};


lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
        if(!err && data){
            var parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        }else{
            callback(err,data);
        }
        
    })
}

lib.update = function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err, fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor,function(err){
                if(!err){
                    fs.writeFile(fileDescriptor,stringData,function(err){
                        if(!err){
                            fs.close(fileDescriptor, function(err){
                                if(!err){
                                    callback(false);
                                }else{
                                    callback('Error Closing the existing file');
                                }
                            })                            
                        }else{
                            callback('Error writing to existing file')
                        }
                    })
                }else{
                    callback('Erro truncating file');
                }
            })
        }else{
            callback('Could not open the file for updating');
        }
    });
}

//Deleting a file

lib.delete = function(dir,file,callback){
    //unlinking
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false);
        }else{
            callback('Error deleting file');
        }
    })
}


//Export the module 
module.exports = lib;