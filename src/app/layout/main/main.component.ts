import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  viewPreload = true;

  constructor() { 
  }

  ngOnInit(): void {
    setTimeout(this.changeViewPreloader, 3000);
  }

  changeViewPreloader() {
    this.viewPreload = false;
  }

}
