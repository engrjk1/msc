/*
*create and export configuration variable
*
*/
var environments = {};

//staging [default] environement
environments.staging ={
    'httpPort' : 3000,
    'httpsPort':3001,
    'envName': 'staging'
};

environments.production = {
    'httpPort' : 5000,
    'httpsPort':5001,
    'envName' : 'production'
};

//determine which environment was passed as a command line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

//check that the current envrionment is none of the environment, if not default to staging

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;