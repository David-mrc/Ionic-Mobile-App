import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from "@angular/router";
import { routes } from "./app.routes";
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { ApplicationConfig } from "@angular/core";

export const config: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideRouter(routes, withComponentInputBinding()),
  ],
}
