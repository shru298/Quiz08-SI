//Quiz 09 my-fucntion.js code in AWS lambda

'use strict';
console.log('Loading hello world function');
 
exports.handler = async (event) => {
    let keyword = "Please provide a value in the query string parameter in the URL after say?";
    let responseCode = 200;
    console.log("request: " + JSON.stringify(event));
    
    if (event.queryStringParameters && event.queryStringParameters.keyword) {
        console.log("Received word: " + event.queryStringParameters.keyword);
        keyword = event.queryStringParameters.keyword;
    }
 
    let responseBody =  `Shruti says, ${keyword}`;
    let response = {
        statusCode: responseCode, 
        body: (responseBody)
    };
    console.log("response: " + JSON.stringify(response))
    return response;
};
