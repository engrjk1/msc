var name1 = 'Junaid Khan ';
var naming = {}


naming.printName = function(abc, callback){
    callback('Your name is ' + abc);
}

naming.printName(name1,function(printname){
    console.log( ''+printname);
});