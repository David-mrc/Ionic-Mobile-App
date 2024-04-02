import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonTitle, IonHeader, IonButton, IonRow, IonItem, IonAvatar, IonLabel, IonIcon, IonCol } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { mergeMap, of } from 'rxjs';
import { UserService } from './services/user.service';
import { computedAsync } from '@appstrophe/ngx-computeasync';
import { addIcons } from 'ionicons';
import { home, logOutOutline } from 'ionicons/icons';
import { Router } from '@angular/router';


addIcons({ home, logOutOutline });

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet, IonFooter, IonToolbar, IonTitle, IonHeader, IonButton, IonRow, IonItem, IonAvatar, IonLabel, IonIcon, IonCol],
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

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

  goHome() {
    this.router.navigate([''])
  }

}
