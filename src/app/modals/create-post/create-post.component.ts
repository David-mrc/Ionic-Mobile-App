import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Post } from 'src/app/models/post';
import { TopicService } from 'src/app/services/topic.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonList, IonItem, IonInput, IonButton, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-post',
  standalone: true,
  template: `
    <ion-header [translucent]="true">
    <ion-toolbar>
      <ion-title>
        Add Post
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true">
    <form (ngSubmit)="addPost()" [formGroup]="addPostForm">
      <ion-list>
        <ion-item lines="none">
          <ion-input formControlName="name" label="Name" errorText="Name is required"></ion-input>
        </ion-item>
        <ion-item lines="none">
          <ion-textarea formControlName="description" label="Description"></ion-textarea>
        </ion-item>
      </ion-list>
      <ion-button type="submit" [disabled]="addPostForm.invalid" class="submit-button">Validate</ion-button>
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
  imports: [IonHeader, IonToolbar, IonTitle, IonTextarea, IonContent, IonList, IonItem, IonInput, IonButton, ReactiveFormsModule]
})
export class CreatePostModalComponent implements OnInit {
  topicId!: string;
  post!: Post;

  addPostForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly topicService = inject(TopicService);
  private readonly modalCtrl = inject(ModalController);

  ngOnInit(): void {
    this.addPostForm = this.fb.nonNullable.group({
      name: [this.post?.name ?? '', Validators.required],
      description: [this.post?.description ?? '']
    });
  }

  async addPost(): Promise<void> {
    if(this.post?.id) { // edit
      const post: Post = { id: this.post.id, ...this.addPostForm.getRawValue() };
      await this.topicService.editPost(post, this.topicId);
    } else { // create
      const post: Partial<Post> = { ...this.addPostForm.getRawValue() };
      await this.topicService.addPost(post, this.topicId);
    }
    this.modalCtrl.dismiss();
  }
}
