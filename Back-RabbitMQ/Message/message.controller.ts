import {MessageService} from "./message.service";

export default class MessageController {


  constructor(private messageService: MessageService) {}

    sendMessage(message: string, sender: string): String {
    return this.messageService.sendMessage(message,sender);
  }

  getAllMessage(): Promise<string[]> {
    return this.messageService.consumeMessages();
  }


}
