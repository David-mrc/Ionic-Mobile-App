import { Injectable, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, user } from "@angular/fire/auth";
import { firstValueFrom } from 'rxjs';
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly userService = inject(UserService);

  user$ = user(this.auth);

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
}
