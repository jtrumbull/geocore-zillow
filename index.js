var express = require('express');
var busboy = require('connect-busboy');
var csv = require('csvtojson');
var app = express();
var queue = 0;

app.use(busboy());
app.set('port', (process.env.PORT || 5000));

function search (record) {
    
    queue++;
    
    var url = new URL('http://www.zillow.com');
    var params = url.searchParams;
    
    url.pathname = '/webservice/GetDeepSearchResults.htm';
    params.append('zws-id', 'X1-ZWz1blvzsmmwp7_1is62');
    params.append('address', record.address);
    params.append('citystatezip', 
                  record.city + ', ' + 
                  record.state + ' ' + 
                  record.zip);
    params.append('rentzestimate', 'true');
    
    http.get(url.toString(), function (message) {
        var content = '';
        message.on('data', function (data) {
            content+= data;
        });
        message.on('end', function () {
            var response = parseResponse(content);
            response.id = record.id;
            events.emit('response', response);
        });
    });
    
}

function response () {
    
}

app.post('/upload', function(req, res) {
    req.busboy.on('file', function(field, stream, name, encoding, mime) {
        csv().fromStream(stream).on('json', function (data) {
            console.log(data);
        });
    });
    req.busboy.on('finish', function () {
        res.send('Upload finished');
    });
    req.pipe(req.busboy);
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
