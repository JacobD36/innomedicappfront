import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RrhhRoutingModule } from './rrhh-routing.module';
import { PersonalComponent } from './pages/personal/personal.component';


@NgModule({
  declarations: [
    PersonalComponent
  ],
  imports: [
    CommonModule,
    RrhhRoutingModule
  ]
})
export class RrhhModule { }
