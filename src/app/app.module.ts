import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {  HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateeventComponent } from './pages/createevent/createevent.component';
import { UpdateeventComponent } from './pages/updateevent/updateevent.component';
import { EventlistComponent } from './pages/eventlist/eventlist.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VersionHistoryComponent } from './pages/version-history/version-history.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    CreateeventComponent,
    UpdateeventComponent,
    EventlistComponent,
    NavbarComponent,
    VersionHistoryComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
