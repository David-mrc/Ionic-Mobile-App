import { Injectable, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, signInWithCredential, User, user, GoogleAuthProvider } from "@angular/fire/auth";
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { GoogleAuth, User as gUser } from "@codetrix-studio/capacitor-google-auth";
import { isPlatform } from "@ionic/angular";
import { UserService } from "./user.service";
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly userService = inject(UserService);
  googleUser: gUser | null = null;

  user$ = user(this.auth);

  constructor(private router: Router) {
    if(!isPlatform("capacitor")) {
      GoogleAuth.initialize();
    }
  }

  getCurrentUserInfo() {
    return this.auth.currentUser;
  }

  async createUser(email: string, username: string, password: string): Promise<void> {
    const usersFound = await firstValueFrom(this.userService.getByName(username));

    if (usersFound.length > 0) {
      throw new Error;
    }
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    await sendEmailVerification(userCredential.user);
    await this.userService.addUser({ id: userCredential.user.uid, name: username });
    await this.router.navigate(['/lists']);
  }

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/lists']);
  }

  async signOut(): Promise<void> {
    if (this.googleUser){
      await GoogleAuth.signOut();
      this.googleUser = null;
    }
    await signOut(this.auth);
    await this.router.navigate(['']);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  isConnected(): boolean {
    return !!this.auth.currentUser;
   }

   async googleSignIn() {
    this.googleUser = await GoogleAuth.signIn();
    if (this.googleUser) {
      let username = this.googleUser.givenName + this.googleUser.familyName as string;
      const usersFound = await firstValueFrom(this.userService.getByName(username));
      if (usersFound.length == 0) {
        this.createUser(this.googleUser.email, username, this.googleUser.id);
      } else {
        await this.signIn(this.googleUser.email, this.googleUser.id);
      }
    }
   }

   async googleRefresh() {
    const authCode = await GoogleAuth.refresh();
    console.log("refresh", authCode);
   }

}
