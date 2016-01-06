(function (){
  var net = require('net');
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
//if a variable is always going to stay constant you can make them with
//letters being capital

  var port = process.argv[3] || 9000;
  var host = process.argv[2] || 'localhost';
  var uri = '/';
  var request = null;

  function setHeader(client){
    var date = createDate(currentDate);
    client.write(request+ uri + ' HTTP/1.1\n' +
        'Host: ' + host + '\n' +
          date + '\n' +
          'User-Agent: Chrome\n\n');
    console.log(request);
    }

  function clientConnect() {
    var client = net.connect(port, host, function(){
      setHeader(client);
    });

    client.on('data', function(data){
      console.log('DATA' + data);
      client.end();
    });

    client.on('end', function(){
      console.log('End connection');
    });
  }

  function runClient() {
    if(process.argv[4]=== '-G') {
      request = 'GET ';
    } else if (process.argv[4]==='-P') {
      request = 'POST ';
    } else if (process.argv[4]==='-D') {
      request = 'DELETE ';
    } else if (process.argv[4]==='-H') {
      request = 'GET ';
      returnHead();
    } else {
      request = 'GET ';
    }
    //fix this to catch incomplete entries into command line
    if(process.argv[2]) {
      var uriArry = process.argv[2].split('/');
      if(uriArry.length > 1) {
        host = uriArry.shift();
        uri = '/' + uriArry.join('/');
      }
      clientConnect();
    } else {
      console.log('node client.js [Host name] [Port Number]');
    }
  }

  runClient();
})();