import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RrhhRoutingModule } from './rrhh-routing.module';
import { PersonalComponent } from './pages/personal/personal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PersonalComponent
  ],
  imports: [
    CommonModule,
    RrhhRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RrhhModule { }
