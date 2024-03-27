import { Injectable, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, User, user } from "@angular/fire/auth";
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { GoogleAuth, User as gUser } from "@codetrix-studio/capacitor-google-auth";
import { isPlatform } from "@ionic/angular";
import { UserService } from "./user.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly userService = inject(UserService);
  googleUser: gUser | null = null;

  user$ = user(this.auth);

  constructor() {
    if(!isPlatform("capacitor")) {
      GoogleAuth.initialize();
    }
  }


  async createUser(email: string, username: string, password: string): Promise<void> {
    const usersFound = await firstValueFrom(this.userService.getByName(username));

    if (usersFound.length > 0) {
      throw new Error;
    }
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    await sendEmailVerification(userCredential.user);
    await this.userService.addUser({ id: userCredential.user.uid, name: username });
  }

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
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
      //TODO: register if doesn't exist else login firestore
    }
    console.log("google user:", this.googleUser);
   }

   async googleRefresh() {
    const authCode = await GoogleAuth.refresh();
    console.log("refresh", authCode);
   }

   async googleSignOut() {
    await GoogleAuth.signOut();
    this.googleUser = null;
   }
}
