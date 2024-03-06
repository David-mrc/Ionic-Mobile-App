import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { Topic, Topics } from '../models/topic';
import { Post } from '../models/post';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private readonly toastController = inject(ToastController);

  private topics: WritableSignal<Topics> = signal<Topics>([]);

  constructor() { }

  getAll(): Signal<Topics> {
    return this.topics.asReadonly();
  }

  get(topicId: Signal<string>): Signal<Topic | null> {
    return computed(() => this.topics().find(t => t.id === topicId()) ?? null);
  }

  addTopic(topic: Topic): void {
    this.topics.set([...this.topics(), topic]);
    this.presentToast('success', 'Topic successfully created');
  }

  addPost(post: Post, topicId: string): void {
    this.topics.update(topics => topics.map(t =>
      // in case of the topic we want to edit, we add the new post to its posts list
      // else we return the existing topic
      t.id === topicId ? { ...t, posts: [...t.posts, post] } : t
    ));
    this.presentToast('success', 'Post successfully created');
  }

  deleteTopic(topic: Topic): void {
    this.topics.update(topics => topics.filter(t => t.id !== topic.id));
    this.presentToast('success', 'Topic successfully deleted');
  }

  deletePost(post: Post, topicId: string): void {
    this.topics.update(topics => topics.map(t =>
      // in case of the topic we want to edit, we filter its posts list to remove the given post
      // else we return the existing topic
      t.id === topicId
        ? {
          ...t,
          posts: t.posts.filter(p => p.id !== post.id)
        }
        : t
    ));
    this.presentToast('success', 'Post successfully deleted');
  }

  editPost(post: Post, topicId: string): void {
    this.topics.update(topics => topics.map(t =>
      // in case of the topic we want to edit, we iterate over its posts list to edit the given post
      // else we return the existing topic
      t.id === topicId
        ? {
          ...t,
          posts: t.posts.map(p =>
            p.id === post.id
              ? post
              : p)
        }
        : t
    ));
    this.presentToast('success', 'Post successfully modified');
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
