import { Component, OnInit, Signal, ViewChild, inject } from '@angular/core';
import { NgTemplateOutlet } from "@angular/common";
import { TopicService } from 'src/app/services/topic.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonList, IonItem, IonInput, IonButton, IonLabel, IonListHeader, IonAvatar, IonChip, IonIcon, IonSearchbar, IonActionSheet } from '@ionic/angular/standalone';
import { Topic } from 'src/app/models/topic';
import { UserService } from 'src/app/services/user.service';
import { UserProfiles } from 'src/app/models/user-profile';
import { add, ellipsisHorizontal } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonActionSheetCustomEvent, OverlayEventDetail } from '@ionic/core';
import { firstValueFrom } from 'rxjs';

addIcons({ add, ellipsisHorizontal });

@Component({
  selector: 'app-manage-topic-access',
  standalone: true,
  template: `
    <ion-header [translucent]="true">
    <ion-toolbar>
      <ion-title>
        Manage Topic Access
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true">
    <ion-searchbar #search
      show-cancel-button="focus"
      placeholder="Search for a new contributor"
      [debounce]="500"
      (ionInput)="searchContributor($event)"
    ></ion-searchbar>
    <ion-list>
      @for(user of usersFound; track usersFound) {
        <ng-container *ngTemplateOutlet="userTemplate; context: { $implicit: user.name, type: 'none' }"/>
      }
    </ion-list>

    <ion-list>
      <ion-list-header>
        <ion-label>Owner</ion-label>
      </ion-list-header>
      <ng-container *ngTemplateOutlet="userTemplate; context: { $implicit: topic().owner, type: 'owner' }"/>
    </ion-list>

    <ion-list>
      <ion-list-header>
        <ion-label>Editors</ion-label>
      </ion-list-header>
      @for(editor of topic().editors; track topic().editors) {
        <ng-container *ngTemplateOutlet="userTemplate; context: { $implicit: editor, type: 'editor' }"/>
      }
      <ion-list-header>
        <ion-label>Readers</ion-label>
      </ion-list-header>
      @for(reader of topic().readers; track topic().readers) {
        <ng-container *ngTemplateOutlet="userTemplate; context: { $implicit: reader, type: 'reader' }"/>
      }
    </ion-list>
  </ion-content>

  <ng-template #userTemplate let-username let-type="type">
    <ion-item lines="none">
      <ion-avatar aria-hidden="true" slot="start">
        <img alt="User image" src="https://ionicframework.com/docs/img/demos/avatar.svg"/>
      </ion-avatar>
      <ion-label>{{ username }}</ion-label>

      @if(type === 'editor') {
        <ion-button shape="round" id="open-action-sheet-{{ username }}">
          <ion-icon name="ellipsis-horizontal"></ion-icon>
        </ion-button>
        <ion-action-sheet
          trigger="open-action-sheet-{{ username }}"
          [buttons]="editorActionSheet"
          (didDismiss)="processAction($event, username)"
        ></ion-action-sheet>
      } @else if(type === 'reader') {
        <ion-button shape="round" id="open-action-sheet-{{ username }}">
          <ion-icon name="ellipsis-horizontal"></ion-icon>
        </ion-button>
        <ion-action-sheet
          trigger="open-action-sheet-{{ username }}"
          [buttons]="readerActionSheet"
          (didDismiss)="processAction($event, username)"
        ></ion-action-sheet>
      } @else if(type === 'none') {
        <ion-button shape="round" (click)="addContributor(username)">
          <ion-icon name="add"></ion-icon>
        </ion-button>
      }
    </ion-item>
  </ng-template>
  `,
  styles: [`
    .submit-button {
      position: fixed;
      bottom: 0;
      width: 100%;
    }
  `],
  imports: [IonHeader, IonToolbar, IonTitle, IonTextarea, IonContent, IonList, IonItem, IonInput, IonButton, IonLabel, IonListHeader, IonAvatar, IonChip, IonIcon, IonSearchbar, IonActionSheet, NgTemplateOutlet]
})
export class ManageTopicAccessModalComponent implements OnInit {
  topic!: Signal<Topic>;

  @ViewChild('search') searchbar!: IonSearchbar;

  constributors!: string[];
  usersFound: UserProfiles = [];

  private readonly topicService = inject(TopicService);
  private readonly userService = inject(UserService);

  deleteActionButton = {
    text: 'Delete',
    role: 'destructive',
    data: {
      action: 'delete',
    },
  };

  cancelActionButton = {
    text: 'Cancel',
    role: 'cancel',
  }

  editorActionSheet = [
    this.deleteActionButton,
    {
      text: 'Switch to reader',
      data: {
        action: 'to reader',
      },
    },
    this.cancelActionButton,
  ];

  readerActionSheet = [
    this.deleteActionButton,
    {
      text: 'Switch to editor',
      data: {
        action: 'to editor',
      },
    },
    this.cancelActionButton,
  ];

  ngOnInit(): void {
    const topic = this.topic();
    this.constributors = [topic.owner, ...topic.editors, ...topic.readers];
  }

  async searchContributor(event: any): Promise<void> {
    const query = event.target.value.toLowerCase();
    this.usersFound = await firstValueFrom(this.userService.getByName(query, this.constributors));
  }

  async addContributor(username: string): Promise<void> {
    const topic = this.topic();
    const readers = [...(topic.readers ?? []), username];
    await this.topicService.editTopic({ readers }, topic.id);
    this.searchbar.value = null;
    this.constributors.push(username);
    this.usersFound = [];
  }

  async deleteContributor(username: string): Promise<void> {
    const topic = this.topic();
    const editors = (topic.editors ?? []).filter(editor => editor !== username);
    const readers = (topic.readers ?? []).filter(reader => reader !== username);
    await this.topicService.editTopic({ editors, readers }, topic.id);
    this.constributors = this.constributors.filter(contributor => contributor !== username);
  }

  async toReader(username: string): Promise<void> {
    const topic = this.topic();
    const editors = (topic.editors ?? []).filter(editor => editor !== username);
    const readers = [...(topic.readers ?? []), username];
    await this.topicService.editTopic({ editors, readers }, topic.id);
  }

  async toEditor(username: string): Promise<void> {
    const topic = this.topic();
    const readers = (topic.readers ?? []).filter(reader => reader !== username);
    const editors = [...(topic.editors ?? []), username];
    await this.topicService.editTopic({ editors, readers }, topic.id);
  }

  protected processAction(event: IonActionSheetCustomEvent<OverlayEventDetail>, username: string): void {
    switch (event.detail.data?.action) {
      case "delete":
        this.deleteContributor(username);
        break;
      case "to reader":
        this.toReader(username);
        break;
      case "to editor":
        this.toEditor(username);
        break;
      default:
        break;
    }
  }
}
