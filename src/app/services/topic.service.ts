import { Injectable } from '@angular/core';
import { Topic } from '../models/topic';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private topics: Topic[];
  constructor() {
    this.topics = [
      { id:1, name:"hello", posts:[]},
      { id:2, name:"world", posts:[]},
      { id:3, name:"hehe", posts:[]}
    ];
  }

  getAll(): Topic[]{
    return this.topics;
  };

  get(topicId: string): Topic {
    const t: Topic = { id:-1, name:"Invalid", posts:[]};
    for(var topic of this.topics){
      if(String(topic.id) === topicId){
        return topic;
      }
    };
    return t;
  };

  addTopic(topic: Topic): void {
    this.topics.push(topic);
  };

  addPost(post: Post, topicId: string): void {
    const topic = this.get(topicId);
    topic.posts.push(post);
  };
}
