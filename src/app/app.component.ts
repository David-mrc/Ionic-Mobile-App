import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonTitle, IonHeader, IonButton, IonRow } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonTitle, IonHeader, IonButton, IonRow],
})
export class AppComponent {
  private readonly authService = inject(AuthService);

  constructor() {}

  isLoggedIn(){
    console.log(this.authService.isConnected())
    return this.authService.isConnected();
  }

  logOut() {
    console.log("logging out");
    this.authService.signOut();
  }
}
