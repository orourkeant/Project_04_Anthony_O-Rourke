console.log('Helpers called');
handlebars.registerHelper('encodeMyString',function(inputData){
    return new Handlebars.SafeString(inputData);
});