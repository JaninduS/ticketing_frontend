import { Routes } from '@angular/router';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { TicketsComponent } from './components/tickets/tickets.component';

export const routes: Routes = [
    {path: '', redirectTo: '/configuration', pathMatch: 'full'},
    {path: 'configuration', component: ConfigurationComponent},
    {path: 'tickets', component: TicketsComponent},
];
