import { createConnection } from 'net';

const serverPort = 8080;
const clientName = process.argv[2] || 'Subscriber';

const client = createConnection({ port: serverPort }, () => {
  console.log(`${clientName} connected to server`);
  client.write(`new-client:${clientName}`);
});

client.on('data', (data) => {
  const message = data.toString().trim();
  console.log(`Received message: ${message}`);
});

client.on('end', () => {
  console.log(`${clientName} disconnected from server`);
});

client.on('error', (err) => {
  console.error(`Client error: ${err}`);
});
