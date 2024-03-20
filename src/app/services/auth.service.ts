import { Injectable, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  /////// temp
  email = "hobik95118@sfpixel.com";
  password = "azerty12"
  //////

  async createUser(
    email: string, 
    password: string
  ) {
    const user = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
    sendEmailVerification(user.user);
  } //: Promise<UserCredential>

  signIn(
    email: string, 
    password: string
  ) {
    signInWithEmailAndPassword(this.auth, this.email, this.password);
  }//: Promise<UserCredential>

  signOut() {
    signOut(this.auth);
  }//: Promise<void>

  sendPasswordResetEmail() {
    sendPasswordResetEmail(this.auth, this.email);
  }
  
  isConnected(){

  }//: User
}