import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { UsersComponent } from './pages/users/users.component';
import { CampusComponent } from './pages/campus/campus.component';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    UsersComponent,
    CampusComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    MaintenanceRoutingModule
  ]
})
export class MaintenanceModule { }
