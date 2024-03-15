import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton, ModalController } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TopicService } from 'src/app/services/topic.service';
import { Topic } from 'src/app/models/topic';

@Component({
  selector: 'app-create-topic',
  standalone: true,
  template: `
    <ion-header [translucent]="true">
    <ion-toolbar>
      <ion-title>
        @if(this.topic?.id) {
          Edit Topic
        } @else {
          Add Topic
        }
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true">
    <form (ngSubmit)="addTopic()" [formGroup]="addTopicForm">
      <ion-list>
        <ion-item lines="none">
          <ion-input formControlName="name" label="Name" errorText="Name is required"></ion-input>
        </ion-item>
      </ion-list>
      <ion-button type="submit" [disabled]="addTopicForm.invalid" class="submit-button">Validate</ion-button>
    </form>
  </ion-content>
  `,
  styles: [`
    .submit-button {
      position: fixed;
      bottom: 0;
      width: 100%;
    }
  `],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton, ReactiveFormsModule]
})
export class CreateTopicModalComponent implements OnInit {
  topic?: Topic;

  addTopicForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly topicService = inject(TopicService);
  private readonly modalCtrl = inject(ModalController);

  ngOnInit(): void {
    this.addTopicForm = this.fb.nonNullable.group({
      name: [this.topic?.name ?? '', Validators.required]
    });
  }

  async addTopic(): Promise<void> {
    const topic: Partial<Topic> = {
      ...this.addTopicForm.getRawValue()
    };

    if(this.topic?.id) { // edit
      await this.topicService.editTopic(topic, this.topic.id);
    } else { // create
      await this.topicService.addTopic(topic);
    }
    this.modalCtrl.dismiss();
  }
}
