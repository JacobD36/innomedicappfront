import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PrincipalComponent } from './pages/principal/principal.component';

const routes: Routes = [
  {
    path:'',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    component: PrincipalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
