import * as amqp from 'amqplib/callback_api';
import { Message } from 'amqplib/callback_api';

export class MessageService {
  // @ts-ignore
  private url: string = process.env.RABBITMQ_URL;
  private queueName: string = "ProjectRabbitMQ";

  sendMessage(message: string, sender: string): string {
    amqp.connect(this.url, (error, connection) => {
      if (error) {
        console.error("Erreur de connexion à RabbitMQ:", error);
        return;
      }

      connection.createChannel((error, channel) => {
        if (error) {
          console.error("Erreur lors de la création du canal:", error);
          return "FALSE";
        }

        channel.assertQueue(this.queueName, { durable: true });
        const messageContent = JSON.stringify({ message, sender });
        channel.sendToQueue(this.queueName, Buffer.from(messageContent));
        console.log("Message envoyé à la file", this.queueName, ":", messageContent);


        setTimeout(() => {
          connection.close();
        }, 500);
      });
    });

    return "TRUE";
  }

  // @ts-ignore
  async consumeMessages(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      amqp.connect(this.url, (error, connection) => {
        if (error) {
          console.error("Erreur de connexion à RabbitMQ:", error);
          reject(error);
          return;
        }

        connection.createChannel(async (error, channel) => {
          if (error) {
            console.error("Erreur lors de la création du canal:", error);
            reject(error);
            return;
          }

          try {
            await channel.assertQueue(this.queueName, { durable: true });

            const messages: string[] = [];

            channel.consume(this.queueName, (msg) => {
              if (msg !== null) {
                messages.push(msg.content.toString());
                channel.ack(<Message>msg);
              } else {
                resolve(messages);
              }
            }, { noAck: false });

            // Attendre un certain temps pour s'assurer que tous les messages sont consommés
            setTimeout(() => {
              connection.close();
              resolve(messages);
            }, 5000); // Ajustez le délai en fonction de la taille de votre file d'attente
          } catch (error) {
            console.error("Erreur lors de la consommation des messages de RabbitMQ:", error);
            reject(error);
          }
        });
      });
    });
  }
}
