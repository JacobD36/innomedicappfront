import { Component, OnInit } from '@angular/core';
import { MainService } from './services/main.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userInfo!: User;
  darkMode: number = 0;

  constructor(
    private mainService: MainService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.seekUser();
    this.darkMode = Number(localStorage.getItem('modo')) || 0;
  }

  cambiaModo() {
    this.darkMode = Number(localStorage.getItem('modo')) || 0;
  }

  async seekUser() {
    const id = localStorage.getItem('id');
    
   await this.mainService.userInfo(id!).subscribe(user => {
      this.userInfo = user;
    }, (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error,
        allowOutsideClick: false
      }).then((result) => {
        this.router.navigateByUrl(`/auth`);  
      });
    });
  }
}
