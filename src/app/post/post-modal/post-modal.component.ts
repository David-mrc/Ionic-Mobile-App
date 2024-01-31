import { Component, ViewChild, inject } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { TopicService } from '../../services/topic.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.scss'],
})
export class PostModalComponent {

  @ViewChild(IonModal) modal!: IonModal; 
  private topicsService = inject(TopicService);

  name: string = ''; 
  description: string = ''; 
  errorName = false;
  errorDescription = false;
  topicId: string = '';

  constructor(private route: ActivatedRoute){
    this.route.paramMap.subscribe(params => {
      this.topicId = params.get('id') as string;
    });
  }
  

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.errorName = false;
    this.errorDescription = false;
  }

  confirm() {
    if(this.name.length >= 3){
      this.modal.dismiss(this.name, 'confirm');
    } else {
      this.errorName = true;
      this.errorDescription = true;
    }
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.topicsService.addPost({id:0, name: this.name, description: this.description}, this.topicId);
      this.name = '';
      this.description = '';
      this.errorName = false;
      this.errorDescription = false;
    }
   }

}
