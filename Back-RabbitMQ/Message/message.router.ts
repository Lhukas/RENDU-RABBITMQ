import {Router} from "express";
import MessageController from "./message.controller";
import {MessageService} from "./message.service";


const messageRouter = Router();

const messageController = new MessageController(new MessageService());

messageRouter.post('/sendMessage', (req, res) => {
  const { message, sender } = req.body;
  res.json(messageController.sendMessage(message,sender))
});

messageRouter.get('/getAllMessage', async (req, res) => {
  try {
    const messages = await messageController.getAllMessage();
    res.json(messages);
  } catch (error) {
    // @ts-ignore
    res.status(500).json({error: error.message});
  }
});

export default messageRouter;
