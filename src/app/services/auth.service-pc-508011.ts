import { Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, User, user } from "@angular/fire/auth";
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  private currentUserSubject!: BehaviorSubject<User | null>;

  constructor(private angularFireAuth: Auth) {
    this.auth = angularFireAuth;
    this.currentUserSubject = new BehaviorSubject<User | null>(null);

    this.auth.onAuthStateChanged((user) => {
      this.currentUserSubject.next(user);
    });
  }

  get currentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
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
  
  async isConnected(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject("User not signed in.");
        }
      });
    });
  }
}
