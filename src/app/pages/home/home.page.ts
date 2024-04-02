import { Component, Signal, ViewChild, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonLabel, IonFab, IonFabButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { MovieList, MovieLists } from '../../models/movie-list';
import { MovieListService } from '../../services/movie-list.service';
import { add, pencil, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CreateListModalComponent } from '../../modals/create-list/create-list.component';
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
        Movie Lists
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Movie Lists</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-list #ionList>
      @for (list of lists(); track list.id) {
        <ion-item-sliding>
          <ion-item-options side="start">
            <ion-item-option (click)="editList(list)" color="primary">
              <ion-icon slot="start" name="pencil"></ion-icon>
              Edit
            </ion-item-option>
          </ion-item-options>

          <ion-item [routerLink]="['/lists/', list.id]">
            <ion-label>{{ list.name }}</ion-label>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option (click)="deleteList(list)" color="danger">
              <ion-icon slot="start" name="trash"></ion-icon>
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      } @empty {
        <div class="empty-container">
          <strong>There are no movie lists yet.</strong>
          <p>You can create one clicking the "+" button below.</p>
        </div>
      }
    </ion-list>
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button (click)="openAddListModale()">
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
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonLabel, IonFab, IonFabButton, IonIcon, CreateListModalComponent],
})
export class HomePage {

  @ViewChild('ionList') ionList!: IonList;

  protected readonly movieListService = inject(MovieListService);
  private readonly modalCtrl = inject(ModalController);
  private readonly toastController = inject(ToastController);

  lists: Signal<MovieLists> = toSignal(this.movieListService.getAll(), {initialValue: []});

  async openAddListModale(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CreateListModalComponent,
    });
    modal.present();

    await modal.onWillDismiss();
  }

  async editList(list: MovieList): Promise<void> {
    if (!this.movieListService.isCurrentUserOwner(list)) {
      presentToast('danger', 'This list can only be edited by its owner', this.toastController);
      this.ionList.closeSlidingItems();
      return;
    }
    const modal = await this.modalCtrl.create({
      component: CreateListModalComponent,
      componentProps: {
        list
      }
    });
    modal.present();
    this.ionList.closeSlidingItems();

    await modal.onWillDismiss();
  }

  deleteList(list: MovieList): void {
    if (!this.movieListService.isCurrentUserOwner(list)) {
      presentToast('danger', 'This list can only be deleted by its owner', this.toastController);
      this.ionList.closeSlidingItems();
      return;
    }
    this.movieListService.deleteList(list);
  }
}
