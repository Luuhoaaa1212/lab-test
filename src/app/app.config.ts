import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    importProvidersFrom([BrowserAnimationsModule]), 
    provideStore(reducers, { metaReducers }),
    provideHttpClient(),
]
  
};
