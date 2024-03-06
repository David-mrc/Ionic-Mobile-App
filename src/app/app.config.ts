import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from "@angular/router";
import { routes } from "./app.routes";
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from "src/environments/environment";

export const config: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideRouter(routes, withComponentInputBinding()),
      importProvidersFrom(
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirestore(() => getFirestore())
      )
  ],
}
