import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, setDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { UserProfile, UserProfiles } from '../models/user-profile';
import { presentToast } from '../helper/toast';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly toastController = inject(ToastController);
  private readonly firestore = inject(Firestore);

  private usersRef = collection(this.firestore, 'users');

  getByName(username: string, ignored?: string[]): Observable<UserProfiles> {
    let constraints = [where("name", "==", username)];

    if (ignored && ignored.length > 0) {
      constraints.push(where("name", "not-in", ignored));
    }
    const q = query(this.usersRef, ...constraints);
    return collectionData(q, { idField: 'id' }) as Observable<UserProfiles>;
  }

  getById(userId: string): Observable<UserProfile> {
    return docData(doc(this.usersRef, userId), { idField: 'id' }) as Observable<UserProfile>;
  }

  async addUser(user: UserProfile): Promise<void> {
    const {id, ...profile} = user;
    await setDoc(doc(this.usersRef, id), profile);
    presentToast('success', 'User successfully created', this.toastController);
  }

  async deleteUser(user: UserProfile): Promise<void> {
    await deleteDoc(doc(this.usersRef, user.id));
    presentToast('success', 'User successfully deleted', this.toastController);
  }

  async editUser(user: Partial<UserProfile>, userId: string): Promise<void> {
    await updateDoc(doc(this.usersRef, userId), user);
    presentToast('success', 'User successfully modified', this.toastController);
  }
}
