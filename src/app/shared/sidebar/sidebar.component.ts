import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Globals } from '../globals';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() userInfo!: User;

  constructor(
    public globals: Globals
  ) { 
  }

  ngOnInit(): void {
  }
}
