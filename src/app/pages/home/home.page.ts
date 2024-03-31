import { Component, Signal, ViewChild, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonLabel, IonFab, IonFabButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { Topic, Topics } from '../../models/topic';
import { TopicService } from '../../services/topic.service';
import { add, pencil, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CreateTopicModalComponent } from '../../modals/create-topic/create-topic.component';
import { RouterLink } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { presentToast } from 'src/app/helper/toast';

addIcons({ add, pencil, trash });

@Component({
  selector: 'app-home',
  template: `
  <ion-header [translucent]="true">
    <ion-toolbar>
      <ion-title>
        Topics
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Topics</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-list #list>
      @for (topic of topics(); track topic.id) {
        <ion-item-sliding>
          <ion-item-options side="start">
            <ion-item-option (click)="editTopic(topic)" color="primary">
              <ion-icon slot="start" name="pencil"></ion-icon>
              Edit
            </ion-item-option>
          </ion-item-options>

          <ion-item [routerLink]="['/topics/', topic.id]">
            <ion-label>{{ topic.name }}</ion-label>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option (click)="deleteTopic(topic)" color="danger">
              <ion-icon slot="start" name="trash"></ion-icon>
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      } @empty {
        <div class="empty-container">
          <strong>There are no Topic yet.</strong>
          <p>You can create one clicking the "+" button below.</p>
        </div>
      }
    </ion-list>
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button (click)="openAddTopicModale()">
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-content>
  `,
  styles: [`
    div.empty-container {
      height: calc(100dvh - 72px); // 56px header + 2*8px padding y
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  `],
  standalone: true,
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonLabel, IonFab, IonFabButton, IonIcon, CreateTopicModalComponent],
})
export class HomePage {

  @ViewChild('list') list!: IonList;

  protected readonly topicService = inject(TopicService);
  private readonly modalCtrl = inject(ModalController);
  private readonly toastController = inject(ToastController);

  topics: Signal<Topics> = toSignal(this.topicService.getAll(), {initialValue: []});

  async openAddTopicModale(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CreateTopicModalComponent,
    });
    modal.present();

    await modal.onWillDismiss();
  }

  async editTopic(topic: Topic): Promise<void> {
    if (!this.topicService.isCurrentUserOwner(topic)) {
      presentToast('danger', 'This topic can only be edited by its owner', this.toastController);
      this.list.closeSlidingItems();
      return;
    }
    const modal = await this.modalCtrl.create({
      component: CreateTopicModalComponent,
      componentProps: {
        topic
      }
    });
    modal.present();
    this.list.closeSlidingItems();

    await modal.onWillDismiss();
  }

  deleteTopic(topic: Topic): void {
    if (!this.topicService.isCurrentUserOwner(topic)) {
      presentToast('danger', 'This topic can only be deleted by its owner', this.toastController);
      this.list.closeSlidingItems();
      return;
    }
    this.topicService.deleteTopic(topic);
  }
}
