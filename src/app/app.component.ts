import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonTitle, IonHeader, IonButton, IonRow, IonItem, IonAvatar, IonLabel } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { mergeMap, of } from 'rxjs';
import { UserService } from './services/user.service';
import { computedAsync } from '@appstrophe/ngx-computeasync';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonTitle, IonHeader, IonButton, IonRow, IonItem, IonAvatar, IonLabel],
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  private user$ = this.authService.user$.pipe(
    mergeMap(user => user ? this.userService.getById(user?.uid) : of(null))
  );
  private user = computedAsync(() => this.user$);
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

  getGenericUserInfo() {
    return {email: this.authService.getCurrentUserInfo()?.email, name: this.user()?.name};
  }

  logOut() {
    this.authService.signOut();
  }

}
