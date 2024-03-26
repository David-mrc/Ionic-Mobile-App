import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { Observable, combineLatestWith, firstValueFrom, map } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, addDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
import { User, Users } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly toastController = inject(ToastController);
  private readonly firestore = inject(Firestore);

  private usersRef = collection(this.firestore, 'users');

  async search(username: string, excluded?: string[]): Promise<Users> {
    let constraints = [where("name", "==", username)];

    if (excluded && excluded.length > 0) {
      constraints.push(where("name", "not-in", excluded));
    }
    const q = query(this.usersRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()})) as Users;
  }

  getAll(): Observable<Users> {
    return collectionData(this.usersRef, { idField: 'id' }) as Observable<Users>;
  }

  get(userId: string): Observable<User> {
    const topicRef = doc(this.usersRef, userId);
    return docData(topicRef, { idField: 'id' }) as Observable<User>;
  }

  async addUser(user: User): Promise<void> {
    await addDoc(this.usersRef, user);
    this.presentToast('success', 'User successfully created');
  }

  async deleteUser(user: User): Promise<void> {
    await deleteDoc(doc(this.usersRef, user.id));
    this.presentToast('success', 'User successfully deleted');
  }

  async editUser(user: Partial<User>, userId: string): Promise<void> {
    await updateDoc(doc(this.usersRef, userId), user);
    this.presentToast('success', 'User successfully modified');
  }

  private async presentToast(color: 'success' | 'danger', message: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
}
