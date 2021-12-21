import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { CampusComponent } from './pages/campus/campus.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'users',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    component: UsersComponent
  },
  {
    path: 'campus',
    component: CampusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }