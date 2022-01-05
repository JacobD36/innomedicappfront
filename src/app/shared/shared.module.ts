import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReadingComponent } from './reading/reading.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartComponent } from './chart/chart.component';
import { NgChartsModule } from 'ng2-charts';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    ReadingComponent,
    ChartComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgChartsModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    ReadingComponent,
    ChartComponent,
    SearchComponent
  ]
})
export class SharedModule { }
