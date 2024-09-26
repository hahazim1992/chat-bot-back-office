import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatbotListComponent } from './chatbot-list/chatbot-list.component';
import { ChatbitAddEditComponent } from './chatbit-add-edit/chatbit-add-edit.component';
import { ChatUIComponent } from './chat-ui/chat-ui.component';

const routes: Routes = [
  { path: '', redirectTo: '/chatbots', pathMatch: 'full' },
  { path: 'chatbots', component: ChatbotListComponent },
  { path: 'chatbots/add', component: ChatbitAddEditComponent },
  { path: 'chatbots/edit/:chatbot_name', component: ChatbitAddEditComponent },
  {
    path: 'chatbots/edit/:chatbot_name/playground',
    component: ChatUIComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
