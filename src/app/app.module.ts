import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {RouterModule} from '@angular/router';
import {routes} from './routes';
import {SuiModule} from 'ng2-semantic-ui';
import { CreateComponent } from './create/create.component';
import {FormsModule} from '@angular/forms';
import { ShowComponent } from './show/show.component';
import { ContributeFormComponent } from './contribute-form/contribute-form.component';
import { RequestsComponent } from './requests/requests.component';
import { CreateRequestComponent } from './create-request/create-request.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateComponent,
    ShowComponent,
    ContributeFormComponent,
    RequestsComponent,
    CreateRequestComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    SuiModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
