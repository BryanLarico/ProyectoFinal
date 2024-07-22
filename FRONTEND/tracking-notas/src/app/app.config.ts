import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes'; 


export const appConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),

  ]
};
