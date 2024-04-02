import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton, ModalController } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovieListService } from 'src/app/services/movie-list.service';
import { MovieList } from 'src/app/models/movie-list';

@Component({
  selector: 'app-create-list',
  standalone: true,
  template: `
    <ion-header [translucent]="true">
    <ion-toolbar>
      <ion-title>
        @if(this.list?.id) {
          Edit Movie List
        } @else {
          Add Movie List
        }
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true">
    <form (ngSubmit)="addList()" [formGroup]="addListForm">
      <ion-list>
        <ion-item lines="none">
          <ion-input formControlName="name" label="Name" errorText="Name is required"></ion-input>
        </ion-item>
      </ion-list>
      <ion-button type="submit" [disabled]="addListForm.invalid" class="submit-button">Validate</ion-button>
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
export class CreateListModalComponent implements OnInit {
  list?: MovieList;

  addListForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly movieListService = inject(MovieListService);
  private readonly modalCtrl = inject(ModalController);

  ngOnInit(): void {
    this.addListForm = this.fb.nonNullable.group({
      name: [this.list?.name ?? '', Validators.required]
    });
  }

  async addList(): Promise<void> {
    const list: Partial<MovieList> = {
      ...this.addListForm.getRawValue()
    };

    if(this.list?.id) { // edit
      await this.movieListService.editList(list, this.list.id);
    } else { // create
      await this.movieListService.addList(list);
    }
    this.modalCtrl.dismiss();
  }
}
