import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Movie } from 'src/app/models/movie';
import { MovieListService } from 'src/app/services/movie-list.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonList, IonItem, IonInput, IonButton, IonDatetimeButton, IonDatetime, IonModal, IonLabel, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-movie',
  standalone: true,
  template: `
    <ion-header [translucent]="true">
    <ion-toolbar>
      <ion-title>
        @if(this.movie?.id) {
          Edit Movie
        } @else {
          Add Movie
        }
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true">
    <form (ngSubmit)="addMovie()" [formGroup]="addMovieForm">
      <ion-list>
        <ion-item lines="none">
          <ion-input formControlName="title" label="Title" errorText="Title is required"></ion-input>
        </ion-item>
        <ion-item lines="none">
          <ion-textarea formControlName="description" label="Description"></ion-textarea>
        </ion-item>
        <ion-item lines="none">
          <ion-input formControlName="runningTime" label="Running time" errorText="Running time is required"></ion-input>
          <ion-label>minutes</ion-label>
        </ion-item>
        <ion-item lines="none">
          <ion-label>Release date</ion-label>
          <ion-datetime-button
            formControlName="releaseDate"
            label="Release date"
            errorText="Release date is required"
            datetime="datetime"
          ></ion-datetime-button>
          <ion-modal [keepContentsMounted]="true">
            <ng-template>
              <ion-datetime id="datetime" presentation="date" max="{{ ISODate }}" [preferWheel]="true"></ion-datetime>
            </ng-template>
          </ion-modal>
        </ion-item>
      </ion-list>
      <ion-button type="submit" [disabled]="addMovieForm.invalid" class="submit-button">Validate</ion-button>
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
  imports: [IonHeader, IonToolbar, IonTitle, IonTextarea, IonContent, IonList, IonItem, IonInput, IonButton, IonDatetimeButton, IonDatetime, IonModal, IonLabel, ReactiveFormsModule]
})
export class CreateMovieModalComponent implements OnInit {
  listId!: string;
  movie?: Movie;

  addMovieForm!: FormGroup;

  ISODate: string;

  private readonly fb = inject(FormBuilder);
  private readonly movieListService = inject(MovieListService);
  private readonly modalCtrl = inject(ModalController);

  constructor() {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 10);
    this.ISODate = date.toISOString();
  }

  ngOnInit(): void {
    this.addMovieForm = this.fb.nonNullable.group({
      title: [this.movie?.title ?? '', Validators.required],
      description: [this.movie?.description ?? ''],
      runningTime: [this.movie?.runningTime ?? 0, Validators.compose([
        Validators.required,
        Validators.min(1)
      ])],
      releaseDate: [this.movie?.releaseDate ?? new Date(), Validators.required],
    });
  }

  async addMovie(): Promise<void> {
    const movie: Partial<Movie> = {
      ...this.addMovieForm.getRawValue()
    };

    if (this.movie?.id) { // edit
      await this.movieListService.editMovie(movie, this.listId, this.movie.id);
    } else { // create
      await this.movieListService.addMovie(movie, this.listId);
    }
    this.modalCtrl.dismiss();
  }
}
