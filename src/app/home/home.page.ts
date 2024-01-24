import { Component } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  topics: Topic[];

  constructor(private topicsService: TopicService) {
    this.topics = this.topicsService.getAll();
  }

}
