import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {CreateComponent} from './create/create.component';
import {ShowComponent} from './show/show.component';
import {RequestsComponent} from './requests/requests.component';
import {CreateRequestComponent} from './create-request/create-request.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'campaigns',
    children: [
      {
        path: 'create',
        component: CreateComponent
      },
      {
        path: ':address',
        component: ShowComponent
      },
      {
        path: ':address/requests',
        component: RequestsComponent
      },
      {
        path: ':address/requests/create',
        component: CreateRequestComponent
      }
    ]
  }
];
