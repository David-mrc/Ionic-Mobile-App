import { Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, User, user } from "@angular/fire/auth";
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GoogleAuth, User as gUser } from "@codetrix-studio/capacitor-google-auth";
import { isPlatform } from "@ionic/angular";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  user$: Observable<User | null> | undefined; 
  userSubscription: Subscription | undefined;
  googleUser: gUser | null = null;

  constructor(private angularFireAuth: Auth) {
    this.auth = angularFireAuth;
    this.user$ = user(this.auth);
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
    })
    if(!isPlatform("capacitor")) {
      GoogleAuth.initialize();
    }
  }

  async createUser(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await sendEmailVerification(userCredential.user);
    } catch (error) {
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw error;
    }
  }
  
   isConnected(): Boolean {
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
