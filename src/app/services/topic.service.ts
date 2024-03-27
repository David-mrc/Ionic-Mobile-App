import { Injectable, inject } from '@angular/core';
import { Topic, Topics } from '../models/topic';
import { Post, Posts } from '../models/post';
import { ToastController } from '@ionic/angular/standalone';
import { Observable, combineLatestWith, firstValueFrom, map } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, addDoc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { presentToast } from 'src/app/helper/toast';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private readonly toastController = inject(ToastController);
  private readonly firestore = inject(Firestore);

  private topicsRef = collection(this.firestore, 'topics');

  getAll(): Observable<Topics> {
    return collectionData(this.topicsRef, { idField: 'id' }) as Observable<Topics>;
  }

  get(topicId: string): Observable<Topic | null> {
    const topicRef = doc(this.topicsRef, topicId);
    const topic$ = docData(topicRef, { idField: 'id' }) as Observable<Topic>;
    const postsRef = collection(this.topicsRef, `${topicId}/posts`);
    const posts$ = collectionData(postsRef, { idField: 'id' }) as Observable<Posts>;

    return topic$.pipe(
      combineLatestWith(posts$),
      map(([topic, posts]) => ({...topic, posts}))
    );
  }

  async addTopic(topic: Partial<Topic>): Promise<void> {
    await addDoc(this.topicsRef, topic);
    presentToast('success', 'Topic successfully created', this.toastController);
  }

  async addPost(post: Partial<Post>, topicId: string): Promise<void> {
    const postsRef = collection(this.topicsRef, `${topicId}/posts`);
    await addDoc(postsRef, post);
    presentToast('success', 'Post successfully created', this.toastController);
  }

  async deleteTopic(topic: Topic): Promise<void> {
    const postsRef = collection(this.topicsRef, `${topic.id}/posts`);
    const posts$ = collectionData(postsRef, { idField: 'id' }) as Observable<Posts>;
    const posts = await firstValueFrom(posts$);

    posts.forEach(post => {
      const postRef = doc(postsRef, post.id);
      deleteDoc(postRef);
    });
    const topicRef = doc(this.topicsRef, topic.id);
    await deleteDoc(topicRef);
    presentToast('success', 'Topic successfully deleted', this.toastController);
  }

  async deletePost(post: Post, topicId: string): Promise<void> {
    const postRef = doc(this.topicsRef, `${topicId}/posts/${post.id}`);
    await deleteDoc(postRef);
    presentToast('success', 'Post successfully deleted', this.toastController);
  }

  async editTopic(topic: Partial<Topic>, topicId: string): Promise<void> {
    const topicRef = doc(this.topicsRef, topicId);
    await updateDoc(topicRef, topic);
    presentToast('success', 'Topic successfully modified', this.toastController);
  }

  async editPost(post: Partial<Post>, topicId: string, postId: string): Promise<void> {
    const postRef = doc(this.topicsRef, `${topicId}/posts/${postId}`);
    await updateDoc(postRef, post);
    presentToast('success', 'Post successfully modified', this.toastController);
  }

}
