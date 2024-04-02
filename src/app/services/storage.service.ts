import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { deleteObject, getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage'
import { presentToast } from '../helper/toast';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly toastController = inject(ToastController);

  private storage = getStorage();

  async getMovieImageURL(listId: string, movieId: string): Promise<string> {
    const imageRef = ref(this.storage, `lists/${listId}/movies/${movieId}`);
    return await getDownloadURL(imageRef);
  }

  async uploadMovieImage(file: File, listId: string, movieId: string): Promise<void> {
    const imageRef = ref(this.storage, `lists/${listId}/movies/${movieId}`);
    await uploadBytes(imageRef, file);
    presentToast('success', 'Image successfully uploaded', this.toastController);
  }

  async deleteMovieImage(listId: string, movieId: string): Promise<void> {
    const imageRef = ref(this.storage, `lists/${listId}/movies/${movieId}`);
    await deleteObject(imageRef);
    presentToast('success', 'Image successfully deleted', this.toastController);
  }
}
