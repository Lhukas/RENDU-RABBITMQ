import * as amqp from 'amqplib';
import * as WebSocket from 'ws';

const amqpUrl = process.env.RABBITMQ_URL;
const queueName = 'ProjectRabbitMQ';

export async function setup() {
    // @ts-ignore
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    const wss = new WebSocket.Server({ port: 8081 });

    wss.on('connection', ws => {
        console.log('Client connected');
        ws.on('message', message => {
            console.log('Received:', message);
        });
    });

    channel.consume(queueName, msg => {
        if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            console.log('Message received from RabbitMQ:', content);
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(content));
                }
            });
            channel.ack(msg);
        }
    }, { noAck: false });

    console.log('WebSocket server is running on ws://localhost:8081');
}

