var net = require('net');
var fs = require('fs');

// var getArry = (['/404.html', '/helium.html', '/hydrogen.html', '/index.html', '/css/styles.css']);
var currentDate = new Date();
var dayArry = ['Sun,', 'Mon,', 'Tues,', 'Wed,', 'Thurs,', 'Fri,', 'Sat'];
var monthArry=['Jan ', 'Feb ', 'Mar ', 'Apr ', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


function createDate (currentDate) {
  var datetime = dayArry[currentDate.getDay()];
  datetime += ' ' + currentDate.getDate() + ' ';
  datetime += monthArry[currentDate.getMonth()];
  datetime += currentDate.getFullYear() + ' ';
  datetime += currentDate.getHours() + ':';
  datetime += currentDate.getMinutes() + ':';
  datetime += currentDate.getSeconds();
  datetime += ' GMT';
  return datetime;
}

function setType(socket, contentType) {
  if (contentType === 'html') {
    return socket.write('Content-Type: text/html; charset=utf-8');
  } else if (contentType === 'css') {
    return socket.write('Content-Type: text/css; charset=utf-8');
  } else if ((contentType !=='html')  && (contentType!== 'css')) {
    return socket.write('charset=utf-8');
  }
}

function writeHeader (socket, status, contentType) {
socket.write(status);
socket.write('Server: Brad\'s Server\n');
var date = createDate(currentDate);
socket.write('Date: '+ date + '\n');
setType(socket, contentType);
socket.write('\n\n');
socket.write(''); // remember that the body and headers need a space between
}

var myServer= net.createServer(function(socket) { //this function is a connection event handler...goes off everytime
  socket.setEncoding('utf-8');
  console.log("we have a signal!");

  socket.on('data', function(buffer){
  var buff = buffer.toString().split('\n');//seperates all buffer into array wherever line returns
  var newBuff = buff[0].split(' '); //chooses first position which is ex:'GET /index.html HTTP/1.1\r' slits into new array by spaces
  var uri = newBuff[1]; //takes 2nd postion of new array ex: 'index.html'
  var uriSplit= uri.split('.'); //splits last array by the period and makes new one ex [index, html]
  var contentType = uriSplit[uriSplit.length-1]; //takes last position of last array ex [html]
  var httpVer = newBuff[2];//I believe this is taking the '/r' with it but not showing it, but it makes it be overwritten when trying to concat it with something else.
console.log(newBuff[2]);
  // if((contentType !=='html')  && (contentType!== 'css')) {
  //   uri = '/index.html';
  //   contentType = 'html';
  // }

  fs.readFile('.'+ uri, function (err, data) {
    if (err) {
      //contentType = 'html';
      return fs.readFile('404.html', function (err, erData) {
        if (err) {
          return socket.destroy();
        }

        var statusFour = 'HTTP/1.1 404 NOT FOUND\n';
        writeHeader(socket, statusFour, contentType);
        socket.write(erData);
        return socket.destroy();
      });
    }
    var statusTwo = 'HTTP/1.1 200 OK\n';
    writeHeader(socket, statusTwo, contentType);
    socket.write(data);
    return socket.end();
  });
  });



}) ;

myServer.listen({
  port: 9000
}, function() {
  console.log('server started!');

});
