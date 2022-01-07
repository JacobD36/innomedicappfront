import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalComponent } from './pages/personal/personal.component';
import { AuthGuard } from '../guards/auth.guard';
import { BusinessComponent } from './pages/business/business.component';

const routes: Routes = [
  {
    path: 'personal',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    component: PersonalComponent
  },
  {
    path: 'business',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    component: BusinessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RrhhRoutingModule { }
