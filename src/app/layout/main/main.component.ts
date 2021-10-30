import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  viewPreloader = true;

  constructor(
    private cd: ChangeDetectorRef) { 
  }

  ngOnInit(): void {
    setTimeout(
        this.quitPreloader, 
      1000);

    this.cd.detectChanges();
  }

  quitPreloader() {
    this.viewPreloader = false;
  }

}
