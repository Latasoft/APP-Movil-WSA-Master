import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonFooter,
  IonItem,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { NgZone } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { MensajeService } from 'src/app/services/mensaje.service';
import { Mensaje } from 'src/app/models/mesnaje';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule,
    IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonFooter,
  IonItem,
  IonInput,
  IonButton,
  IonIcon
  ]
})
export class ChatPage implements OnInit,OnDestroy {
  // En tu clase
@ViewChild(IonContent) content!: IonContent;

  groupId: string='';
  _id: string = ''; // Reemplazar con ID del usuario autenticado
  messages: Mensaje[] = [];
  newMessage: string = '';
  cursor: string = '';
  hasMore = true;
  limit = 9;
  loadingMore = false;
  readyToRender = false;
  private socketSub: any;

  constructor(private authService:AuthService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private mensajeService:MensajeService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.loadId(); 
    this.groupId = this.route.snapshot.paramMap.get('id')!;

    // Conectar al socket y unirse a la sala
    this.socketService.joinRoom(this.groupId);

    // Cargar mensajes iniciales
    this.loadMessages();

    // Escuchar mensajes nuevos
    this.socketService.onNewMessage().subscribe((msg: Mensaje) => {
      this.ngZone.run(() => {
        this.messages.push(msg);
        this.scrollToBottom();
        this.cdRef.detectChanges();   // <— fuerza actualización de vista
      });
    });
  }

  loadMessages() {
    this.loadingMore = true;

    this.mensajeService.getMessages(this.groupId, this.cursor, this.limit)
    .subscribe({
      next: (res) => {
        this.messages = [...res.messages, ...this.messages];
        this.cursor = res.cursor; // el nuevo cursor será el mensaje más antiguo
        this.hasMore = res.hasMore;
        this.loadingMore = false;
        this.readyToRender = true; //
        this.scrollToBottom();
      },
      error: () => {
        this.loadingMore = false;
      }
    });
  }

  loadPreviousMessages() {
    if (!this.hasMore || this.loadingMore) return;
  
    this.loadingMore = true;
  
    this.mensajeService.getMessages(this.groupId, this.cursor, this.limit)
      .subscribe({
        next: (res) => {
          this.messages = [...res.messages, ...this.messages];
          this.cursor = res.cursor;
          this.hasMore = res.hasMore;
          this.loadingMore = false;
        },
        error: () => {
          this.loadingMore = false;
        }
      });
  }

  ngAfterViewChecked() {
    if (this.readyToRender) {
      this.scrollToBottom();
      this.readyToRender = false; // Prevent continuous scrolling
    }
  }
  

  enviarMensaje() {
    if (!this.newMessage.trim()) return;

    const mensaje: Omit<Mensaje, '_id' | 'sentAt'> = {
      group: this.groupId,
      sender: this._id,
      content: this.newMessage.trim()
    };

    this.mensajeService.createMessage(mensaje).subscribe(() => {
      this.newMessage = '';
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(300);
      }
    }, 100);
  }

  isOwnMessage(msg: Mensaje): boolean {
    return typeof msg.sender === 'string'
      ? msg.sender === this._id
      : msg.sender._id === this._id;
  }

  getSenderName(msg: Mensaje): string {
    return typeof msg.sender === 'string' ? msg.sender : msg.sender.username;
  }

  loadId(){
    this._id=this.authService.getIdFromToken()??'';
  }
  ngOnDestroy(): void {
    this.socketSub?.unsubscribe(); // Limpia la suscripción
  }

}
