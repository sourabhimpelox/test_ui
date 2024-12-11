import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { EventlistComponent } from './pages/eventlist/eventlist.component';
import { CreateeventComponent } from './pages/createevent/createevent.component';
import { UpdateeventComponent } from './pages/updateevent/updateevent.component';
import { VersionHistoryComponent } from './pages/version-history/version-history.component';


const routes: Routes = [
  { path: 'list', component: EventlistComponent },
  { path: 'create-event', component: CreateeventComponent },
  { path: 'update-event/:id', component:UpdateeventComponent },
  { path: 'version-history/:crn', component: VersionHistoryComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
