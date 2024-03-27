import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonTitle, IonHeader, IonButton, IonRow } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonTitle, IonHeader, IonButton, IonRow],
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private router: Router = inject(Router);
  constructor() {}

  isLoggedIn(){
    return this.authService.isConnected();
  }

  logOut() {
    this.router.navigate(['']);
    this.authService.signOut();
  }
}
