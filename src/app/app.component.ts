import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonTitle, IonHeader, IonButton, IonRow, IonItem, IonAvatar, IonLabel } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonTitle, IonHeader, IonButton, IonRow, IonItem, IonAvatar, IonLabel],
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private router: Router = inject(Router);
  constructor() {}

  isLoggedIn(){
    return this.authService.isConnected();
  }

  isLoggedInGoogle(){
    return !!this.authService.googleUser;
  }

  getGoogleAvatar(): string {
    return this.authService.googleUser ? this.authService.googleUser.imageUrl : "" ;
  }

  getGoogleInformation() {
    return this.authService.googleUser;
  }

  logOut() {
    this.authService.signOut();
  }

}
