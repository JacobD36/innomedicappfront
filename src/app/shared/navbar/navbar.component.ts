import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from '../../auth/services/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { Globals } from '../globals';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() onModeChange: EventEmitter<number> = new EventEmitter<number>();
  modoDark: number = 0;
  modoSwitch: boolean = false;

  constructor(
    private authService: LoginService,
    private router: Router,
    public globals: Globals
  ) { }

  ngOnInit(): void {
    this.modoDark = Number(localStorage.getItem('modo')) || 0;
    if(this.modoDark == 1) {
      this.modoSwitch = true;
    }
  }

  cambiaModo() {
    if(this.modoDark == 1) {
      this.modoDark = 0;
      localStorage.setItem('modo', '0');
    } else {
      this.modoDark = 1;
      localStorage.setItem('modo', '1');
    }
    this.onModeChange.emit(this.modoDark);
  }

  salir() {
    Swal.fire({
      title: '¿Está seguro?',
      text: "Su sesión finalizará",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if(result.value) {
        this.authService.logout();
        this.router.navigateByUrl('/auth');
      }  
    })
  }
}
