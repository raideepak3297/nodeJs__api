var debugging_enabled = true;

exports.logDatabaseQueryError = function (eventFired, error, result) {
    if(debugging_enabled) {
        console.log("Event: ", eventFired);
        console.log("Error: ", JSON.stringify(error));
        console.log("Result: ", JSON.stringify(result));
    }
};

exports.consolelog = function (eventFired, error, result) {
    if(debugging_enabled) {
        console.log(eventFired, error, result)
    }
};


/*
*-------------------
* LOG REQUEST PARAMS
*-------------------
*/
exports.logRequest =  function(request) {
    if(debugging_enabled) {
        console.log("REQUEST: " + JSON.stringify(request.body));
    }
};

exports.logGetRequest =  function(request) {
    if(debugging_enabled) {
        console.log("REQUEST: " + JSON.stringify(request.query));
    }
};


/*
*-------------------
* START SECTION
*-------------------
*/

exports.startSection = function (section) {
    if(debugging_enabled) {
        console.log("=========== " +section + " ===========");
    }
};

/*
*-------------------
* LOG RESPONSE
*-------------------
*/

exports.logResponse = function (response) {
    if(debugging_enabled) {
        console.log("RESPONSE: " + JSON.stringify(response,undefined,2));
    }
};