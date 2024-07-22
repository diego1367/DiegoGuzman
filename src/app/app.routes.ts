import { Routes } from '@angular/router';
import { ListUserComponent } from './components/list-user/list-user.component';
import { NewUserComponent } from './components/new-user/new-user.component';

export const routes: Routes = [
    { path: 'listUser', component: ListUserComponent },
    { path: 'newUser/:id', component: NewUserComponent },
    { path: '', redirectTo: '/listUser', pathMatch: 'full' },
    { path: '**', redirectTo: '/listUser' }
];
