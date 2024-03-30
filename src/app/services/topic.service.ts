import { Injectable, inject } from '@angular/core';
import { Topic, Topics } from '../models/topic';
import { Post, Posts } from '../models/post';
import { ToastController } from '@ionic/angular/standalone';
import { Observable, combineLatestWith, firstValueFrom, map, mergeMap, of, switchMap } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, or } from '@angular/fire/firestore';
import { presentToast } from 'src/app/helper/toast';
import { computedAsync } from '@appstrophe/ngx-computeasync';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly toastController = inject(ToastController);
  private readonly firestore = inject(Firestore);

  private user$ = this.authService.user$.pipe(
    mergeMap(user => user ? this.userService.getById(user?.uid) : of(null))
  );
  private user = computedAsync(() => this.user$);

  private topicsRef = collection(this.firestore, 'topics');

  getAll(): Observable<Topics> {
    return this.user$.pipe(
      switchMap(user => user ? this.getUserTopics(user.name) : [])
    );
  }

  get(topicId: string): Observable<Topic | null> {
    const topicRef = doc(this.topicsRef, topicId);
    const topic$ = docData(topicRef, { idField: 'id' }) as Observable<Topic>;
    const postsRef = collection(this.topicsRef, `${topicId}/posts`);
    const posts$ = collectionData(postsRef, { idField: 'id' }) as Observable<Posts>;

    return topic$.pipe(
      combineLatestWith(posts$),
      map(([topic, posts]) => this.canCurrentUserRead(topic) ? {...topic, posts} : null)
    );
  }

  async addTopic(topic: Partial<Topic>): Promise<void> {
    const user = this.user();
    if (!user) {
      throw new Error;
    }
    await addDoc(this.topicsRef, { owner: user.name, ...topic });
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

    await Promise.all(posts.map(post => deleteDoc(doc(postsRef, post.id))));
    await deleteDoc(doc(this.topicsRef, topic.id));
    presentToast('success', 'Topic successfully deleted', this.toastController);
  }

  async deletePost(post: Post, topicId: string): Promise<void> {
    const postRef = doc(this.topicsRef, `${topicId}/posts/${post.id}`);
    await deleteDoc(postRef);
    presentToast('success', 'Post successfully deleted', this.toastController);
  }

  async editTopic(topic: Partial<Topic>, topicId: string): Promise<void> {
    await updateDoc(doc(this.topicsRef, topicId), topic);
    presentToast('success', 'Topic successfully modified', this.toastController);
  }

  async editPost(post: Partial<Post>, topicId: string, postId: string): Promise<void> {
    const postRef = doc(this.topicsRef, `${topicId}/posts/${postId}`);
    await updateDoc(postRef, post);
    presentToast('success', 'Post successfully modified', this.toastController);
  }

  isCurrentUserOwner(topic: Topic): boolean {
    const username = this.user()?.name;
    return !!username && topic.owner === username;
  }

  canCurrentUserEdit(topic: Topic): boolean {
    const username = this.user()?.name;
    return !!username && (
      topic.owner === username || topic.editors.includes(username)
    );
  }

  canCurrentUserRead(topic: Topic): boolean {
    const username = this.user()?.name;
    return !!username && (
      topic.owner === username ||
      topic.editors.includes(username) ||
      topic.readers.includes(username)
    );
  }

  private getUserTopics(username: string): Observable<Topics> {
    const q = query(this.topicsRef,
      or(
        where("owner", "==", username),
        where("editors", "array-contains", username),
        where("readers", "array-contains", username)
      )
    );
    return collectionData(q, { idField: 'id' }) as Observable<Topics>;
  }
}
