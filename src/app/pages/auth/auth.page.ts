import { Component, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonLabel, IonFab, IonFabButton, IonIcon, ModalController, IonButton, IonInput, IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';
import { Topic, Topics } from '../../models/topic';
import { TopicService } from '../../services/topic.service';
import { addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CreateTopicModalComponent } from '../../modals/create-topic/create-topic.component';
import { RouterLink } from '@angular/router';

addIcons({ addOutline });

@Component({
  selector: 'app-auth',
  template: `
  <ion-content>
  <form  #form="">
    <ion-grid>
      <ion-row color="primary" justify-content-center>
        <ion-col align-self-center size-md="6" size-lg="5" size-xs="12">
          <div text-center>
            <h3>Log in</h3>
          </div>
          <div padding>
            <ion-item>
              <ion-input name="email" type="email" placeholder="your@email.com" ngModel required></ion-input>
            </ion-item>
            <ion-item>
              <ion-input name="password" type="password" placeholder="Password" ngModel required></ion-input>
            </ion-item>
          </div>
          <div padding>
            <ion-button  size="large" type="submit" expand="block">Log in</ion-button>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  </form>
  <ion-col align-self-center size-md="6" size-lg="5" size-xs="12">
  <ion-button  size="large" expand="block">Log in Mock</ion-button>
  </ion-col>
  <form  #form="">
    <ion-grid>
      <ion-row color="primary" justify-content-center>
        <ion-col align-self-center size-md="6" size-lg="5" size-xs="12">
          <div text-center>
            <h3>Or create your account</h3>
          </div>
          <div padding>
            <ion-item>
              <ion-input  name="name" type="text" placeholder="Name" ngModel required></ion-input>
            </ion-item>
            <ion-item>
              <ion-input name="email" type="email" placeholder="your@email.com" ngModel required></ion-input>
            </ion-item>
            <ion-item>
              <ion-input name="password" type="password" placeholder="Password" ngModel required></ion-input>
            </ion-item>
            <ion-item>
              <ion-input name="confirm" type="password" placeholder="Password again" ngModel required></ion-input>
            </ion-item>
          </div>
          <div padding>
            <ion-button  size="large" type="submit" expand="block">Register</ion-button>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  </form>
</ion-content>
  `,
  styles: [],
  standalone: true,
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonLabel, IonFab, IonFabButton, IonIcon, CreateTopicModalComponent, IonButton, IonInput, IonGrid, IonCol, IonRow],
})
export class AuthPage {


}
