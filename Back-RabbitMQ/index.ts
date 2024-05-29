const express = require('express');
const cors = require ('cors');
import { setup } from './websocketServer';




import messageRouter from './Message/message.router';
const app = express();

setup().catch(console.error);

app.use(cors())
app.use(express.json())

app.use('/message', messageRouter);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


//npx ts-node index.ts lancer server
// ne pas oublié de lancé rabbitmq