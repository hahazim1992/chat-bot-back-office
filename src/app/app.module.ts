import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatbotListComponent } from './chatbot-list/chatbot-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AppLandingComponent } from './app-landing/app-landing.component';
import { CopyRightComponent } from './copy-right/copy-right.component';
import { HeaderComponent } from './header/header.component';
import { ChatbitAddEditComponent } from './chatbit-add-edit/chatbit-add-edit.component';
import { FormsModule } from '@angular/forms';
import { FileViewerComponent } from './file-viewer/file-viewer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    ChatbotListComponent,
    AppLandingComponent,
    CopyRightComponent,
    HeaderComponent,
    ChatbitAddEditComponent,
    FileViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
