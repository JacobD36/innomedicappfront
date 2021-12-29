import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { UsersComponent } from './pages/users/users.component';
import { CampusComponent } from './pages/campus/campus.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    UsersComponent,
    CampusComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DataTablesModule,
    MaintenanceRoutingModule
  ]
})
export class MaintenanceModule { }
