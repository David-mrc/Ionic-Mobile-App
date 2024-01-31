import { Component, ViewChild, inject } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { TopicService } from '../../services/topic.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-topic-add-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {

  @ViewChild(IonModal) modal!: IonModal; 
  private topicsService = inject(TopicService);

  name: string = ''; 
  error = false;
  

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.error = false;
  }

  confirm() {
    if(this.name.length >= 3){
      this.modal.dismiss(this.name, 'confirm');
    } else {this.error = true}
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.topicsService.addTopic({id: 0, name: this.name, posts: []});
      this.name = '';
      this.error = false;
    }
   }
}
