import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatbotListComponent } from './chatbot-list/chatbot-list.component'; // Adjust the path accordingly

const routes: Routes = [
  { path: '', redirectTo: '/chatbots', pathMatch: 'full' }, // Redirect root path to /chatbots
  { path: 'chatbots', component: ChatbotListComponent }, // Route to your new component
  // Add more routes here if necessary
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
