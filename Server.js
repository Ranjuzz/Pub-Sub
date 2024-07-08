import { createServer } from 'net';
import { createInterface } from 'readline';

const serverPort =  8080; // Port for the server
let clients = [];

const atleast_n = 2; // give the atleast clients
const atmost_n = 5; // give the atmost clients

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const server = createServer((socket) => {
  console.log('Client connected');
  clients.push(socket);
  console.log(`Number of clients: ${clients.length}`);

  socket.on('end', () => {
    clients = clients.filter(client => client !== socket);
    console.log('Client disconnected');
    console.log(`Number of clients: ${clients.length}`);
  });

  socket.on('error', (err) => {
    console.error(`Socket error: ${err}`);
    clients = clients.filter(client => client !== socket);
    console.log('A Client disconnected');
    console.log(`Number of clients: ${clients.length}`);
  });
});

server.listen(serverPort, () => {
  console.log(`Server is listening on port ${serverPort}`);
});

server.on('error', (err) => {
  console.error(`Server error: ${err}`);
});

function broadcastMessage(message) {
  let count = 0;
  if (clients.length > atleast_n) {
    clients.forEach((client) => {
      if(count < atmost_n) {
        client.write(message);
        count+=1;
      }
    });
    return 0;
  }
  return 1;
}

rl.on('line', (input) => {
  let fg = broadcastMessage(input);
  if(fg == 0)
    console.log(`Sending message: ${input}`);
  else  
    console.log('Not enough clients to broadcast message');
  
});
