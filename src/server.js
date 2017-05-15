import http from 'http';
import io from 'socket.io';

let server = http.createServer();
let port = 5555;

server.listen(port);

var socket = io.listen(server);

socket.on('connection', function(client){ 
    console.log('Connection to client established');

    client.on('message',function(event){ 
        console.log('Received message from client!',event);
    });

    client.on('disconnect',function(){
        //clearInterval(interval);
        console.log('Server has disconnected');
    });
});

console.log('Server running at http://127.0.0.1:' + port + '/');