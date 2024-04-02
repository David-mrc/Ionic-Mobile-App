import { Component, OnInit, Signal, ViewChild, inject } from '@angular/core';
import { NgTemplateOutlet } from "@angular/common";
import { MovieListService } from 'src/app/services/movie-list.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonList, IonItem, IonInput, IonButton, IonLabel, IonListHeader, IonAvatar, IonChip, IonIcon, IonSearchbar, IonActionSheet, ModalController } from '@ionic/angular/standalone';
import { MovieList } from 'src/app/models/movie-list';
import { UserService } from 'src/app/services/user.service';
import { UserProfiles } from 'src/app/models/user-profile';
import { add, ellipsisHorizontal } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonActionSheetCustomEvent, OverlayEventDetail } from '@ionic/core';
import { firstValueFrom } from 'rxjs';

addIcons({ add, ellipsisHorizontal });

@Component({
  selector: 'app-manage-list-access',
  standalone: true,
  template: `
    <ion-header [translucent]="true">
    <ion-toolbar>
      <ion-title>
        Manage List Access
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
      <ng-container *ngTemplateOutlet="userTemplate; context: { $implicit: list().owner, type: 'owner' }"/>
    </ion-list>

    <ion-list>
      <ion-list-header>
        <ion-label>Editors</ion-label>
      </ion-list-header>
      @for(editor of list().editors; track list().editors) {
        <ng-container *ngTemplateOutlet="userTemplate; context: { $implicit: editor, type: 'editor' }"/>
      }
      <ion-list-header>
        <ion-label>Readers</ion-label>
      </ion-list-header>
      @for(reader of list().readers; track list().readers) {
        <ng-container *ngTemplateOutlet="userTemplate; context: { $implicit: reader, type: 'reader' }"/>
      }
    </ion-list>
    <ion-button class="submit-button" (click)="dismiss()">OK</ion-button>
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
export class ManageListAccessModalComponent implements OnInit {
  list!: Signal<MovieList>;

  @ViewChild('search') searchbar!: IonSearchbar;

  constributors!: string[];
  usersFound: UserProfiles = [];

  private readonly movieListService = inject(MovieListService);
  private readonly userService = inject(UserService);
  private readonly modalCtrl = inject(ModalController);

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
    const list = this.list();
    this.constributors = [list.owner].concat(list.editors, list.readers);
  }

  async searchContributor(event: any): Promise<void> {
    const query = event.target.value.toLowerCase();
    this.usersFound = await firstValueFrom(this.userService.getByName(query, this.constributors));
  }

  async addContributor(username: string): Promise<void> {
    const list = this.list();
    const readers = [...(list.readers ?? []), username];
    await this.movieListService.editList({ readers }, list.id);
    this.searchbar.value = null;
    this.constributors.push(username);
    this.usersFound = [];
  }

  async deleteContributor(username: string): Promise<void> {
    const list = this.list();
    const editors = (list.editors ?? []).filter(editor => editor !== username);
    const readers = (list.readers ?? []).filter(reader => reader !== username);
    await this.movieListService.editList({ editors, readers }, list.id);
    this.constributors = this.constributors.filter(contributor => contributor !== username);
  }

  async toReader(username: string): Promise<void> {
    const list = this.list();
    const editors = (list.editors ?? []).filter(editor => editor !== username);
    const readers = [...(list.readers ?? []), username];
    await this.movieListService.editList({ editors, readers }, list.id);
  }

  async toEditor(username: string): Promise<void> {
    const list = this.list();
    const readers = (list.readers ?? []).filter(reader => reader !== username);
    const editors = [...(list.editors ?? []), username];
    await this.movieListService.editList({ editors, readers }, list.id);
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

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
