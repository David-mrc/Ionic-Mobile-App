import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { Topic } from 'src/app/models/topic';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  topicId: string = '';
  topic: Topic | null;
  posts: Post[] | null;
  private topicsService = inject(TopicService);

  constructor(private route: ActivatedRoute) { 
    this.topic = null;
    this.posts = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.topicId = params.get('id') as string;
    });
    this.topic = this.topicsService.get(this.topicId);
    this.posts = this.topic.posts;
  }

}
