import { Component, Input, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonLabel, IonFab, IonFabButton, IonIcon, IonButtons, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { MovieListService } from '../../services/movie-list.service';
import { CreateMovieModalComponent } from '../../modals/create-movie/create-movie.component';
import { Movie } from '../../models/movie';
import { computedAsync } from '@appstrophe/ngx-computeasync';
import { addIcons } from 'ionicons';
import { add, people, pencil, trash } from 'ionicons/icons';
import { ManageListAccessModalComponent } from 'src/app/modals/manage-list-access/manage-list-access.component';

addIcons({ add, people, pencil, trash });

@Component({
  selector: 'app-list-details',
  template: `
  <ion-header [translucent]="true">
    <ion-toolbar>
      <ion-title>
        {{ list()?.name }}
      </ion-title>

      <ion-buttons slot="end">
        @if (isCurrentUserOwner()) {
          <ion-button (click)="openManageListAccessModale()">
            <ion-icon slot="icon-only" name="people" color="primary"></ion-icon>
          </ion-button>
        }
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">{{ list()?.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-list #ionList>
      @for (movie of list()?.movies; track movie.id) {
        <ion-item-sliding>
          <ion-item-options side="start">
            <ion-item-option
              (click)="editMovie(movie)"
              color="primary"
              disabled="{{ !canCurrentUserEdit() }}"
            >
              <ion-icon slot="start" name="pencil"></ion-icon>
              Edit
            </ion-item-option>
          </ion-item-options>

          <ion-item>
            <ion-card>
              <ion-grid>
                <ion-row>
                  <ion-col size-xs="4" size-sm="3" size-md="3" size-lg="2" size-xl="2">
                    <img alt="Movie image" src="{{ movie.image }}" width="100%" height="auto"/>
                  </ion-col>
                  <ion-col>
                    <ion-card-header>
                      <ion-card-title>{{ movie.title }}</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      <ion-label>
                        Release date: {{ movie.releaseDate.split("T")[0] }}
                      </ion-label>
                      <ion-label>
                        Running time: {{ movie.runningTime }} minutes
                      </ion-label>
                      {{ movie.description }}
                    </ion-card-content>
                  </ion-col>
                </ion-row>
              </ion-grid>

            </ion-card>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option
              (click)="deleteMovie(movie)"
              color="danger"
              disabled="{{ !canCurrentUserEdit() }}"
            >
              <ion-icon slot="start" name="trash"></ion-icon>
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      } @empty {
        <div class="empty-container">
          <strong>There are no movies yet.</strong>
          <p>You can create one clicking the "+" button below.</p>
        </div>
      }
    </ion-list>

    @if (canCurrentUserEdit()) {
      <ion-fab slot="fixed" vertical="top" horizontal="center" [edge]="true">
        <ion-fab-button (click)="openAddMovieModale()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    }
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
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonLabel, IonFab, IonFabButton, IonIcon, IonButtons, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, CommonModule, FormsModule]
})
export class ListDetailsPage {

  private _listId: WritableSignal<string> = signal('');

  @ViewChild('ionList') ionList!: IonList;

  @Input({ required: true })
  set listId(listId: string) {
    this._listId.set(listId);
  };
  get listId() {
    return this._listId();
  }

  protected readonly movieListService = inject(MovieListService);
  private readonly modalCtrl = inject(ModalController);

  list = computedAsync(() => this.movieListService.get(this.listId));

  async openAddMovieModale() {
    const modal = await this.modalCtrl.create({
      component: CreateMovieModalComponent,
      componentProps: {
        listId: this._listId()
      }
    });
    modal.present();

    await modal.onWillDismiss();
  }

  async openManageListAccessModale() {
    const modal = await this.modalCtrl.create({
      component: ManageListAccessModalComponent,
      componentProps: {
        list: this.list
      }
    });
    modal.present();

    await modal.onWillDismiss();
  }

  async editMovie(movie: Movie) {
    const modal = await this.modalCtrl.create({
      component: CreateMovieModalComponent,
      componentProps: {
        listId: this._listId(),
        movie
      }
    });
    modal.present();
    this.ionList.closeSlidingItems();

    await modal.onWillDismiss();
  }

  deleteMovie(movie: Movie): void {
    this.movieListService.deleteMovie(movie, this._listId());
  }

  protected isCurrentUserOwner(): boolean {
    const list = this.list();
    return !!list && this.movieListService.isCurrentUserOwner(list);
  }

  protected canCurrentUserEdit(): boolean {
    const list = this.list();
    return !!list && this.movieListService.canCurrentUserEdit(list);
  }
}
