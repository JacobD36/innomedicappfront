import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RrhhRoutingModule } from './rrhh-routing.module';
import { PersonalComponent } from './pages/personal/personal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BusinessComponent } from './pages/business/business.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    PersonalComponent,
    BusinessComponent
  ],
  imports: [
    CommonModule,
    RrhhRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RrhhModule { }
