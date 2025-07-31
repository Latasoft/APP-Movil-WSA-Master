import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'], // conexión más estable
    });
  }
  joinRoom(groupId: string) {
    this.socket.emit('joinRoom', groupId);
  }

  sendMessage(data: { room: string; sender: string; content: string }) {
    this.socket.emit('sendMessage', data);
  }

  onNewMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('newMessage', (message) => {
        observer.next(message);
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
