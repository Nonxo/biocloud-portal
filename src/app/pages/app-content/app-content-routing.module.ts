/**
 * Created by Kingsley Ezeokeke on 1/26/2018.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppContentComponent } from './app-content.component';
import { HomeComponent } from './home/home.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SubscriptionHistoryComponent } from './subscription-history/subscription-history.component';

const routes: Routes = [
  {
    path: '',
    component: AppContentComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'config',
        loadChildren: 'app/pages/app-content/app-config/app-config.module#AppConfigModule'
      },
      {
        path: 'subscribe',
        component: SubscribeComponent
      },
      {
        path: 'subscription-history',
        component: SubscriptionHistoryComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: []
})
export class AppContentRoutingModule {
}
