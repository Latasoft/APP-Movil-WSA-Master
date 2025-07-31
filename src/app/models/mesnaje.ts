export interface Mensaje {
    _id?: string;
    group: string;
    sender: string | {
      _id: string;
      username: string;
    };
    content: string;
    sentAt?: string; // Puede no existir en el envío inicial
  }
  