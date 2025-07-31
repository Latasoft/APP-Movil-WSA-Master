import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonFooter, IonButtons, IonButton, IonIcon, IonAlert } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-shared-footer',
  standalone: true,
  imports: [CommonModule, IonFooter, IonButtons, IonButton, IonIcon, IonAlert, TranslatePipe],
  templateUrl: './shared-footer.component.html',
  styleUrls: ['./shared-footer.component.scss']
})
export class SharedFooterComponent implements OnInit {
  isAlertOpen = false;
  alertButtons: any[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.setupAlertButtons();
  }

  private setupAlertButtons() {
    this.alertButtons = [
      {
        text: this.translationService.translate('cancel'),
        role: 'cancel',
        cssClass: 'alert-button-cancel'
      },
      {
        text: this.translationService.translate('continue'),
        role: 'confirm',
        cssClass: 'alert-button-confirm',
        handler: () => {
          this.logout();
        }
      }
    ];
  }

  confirmLogout() {
    this.isAlertOpen = true;
  }

  private logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToVessels() {
    this.router.navigate(['/lista-embarcaciones']);
  }

  navigateToReports() {
    this.router.navigate(['/lista-descarga-reportes']);
  }

  navigateToGroups() {
    this.router.navigate(['/lista-grupos']);
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
}