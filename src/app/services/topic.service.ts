import { Injectable } from '@angular/core';
import { Topic } from '../models/topic';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private topics: Topic[];
  private topic_count: number;

  constructor() {
    this.topics = [];
    this.topic_count = 0;
  }

  getAll(): Topic[]{
    return this.topics;
  };

  get(topicId: string): Topic {
    const tInvalid: Topic = { id:-1, name:"Invalid", posts:[]};
    return this.topics.find((topic) => String(topic.id) === topicId)?? tInvalid;
  };

  addTopic(topic: Topic): void {
    this.topic_count += 1;
    topic.id = this.topic_count;
    this.topics.push(topic);
  };

  addPost(post: Post, topicId: string): void {
    const topic = this.get(topicId);
    post.id = topic.posts.length + 1;
    topic.posts.push(post);
  };
}
