import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatbotListComponent } from './chatbot-list/chatbot-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AppLandingComponent } from './app-landing/app-landing.component';
import { CopyRightComponent } from './copy-right/copy-right.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatbotListComponent,
    AppLandingComponent,
    CopyRightComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
