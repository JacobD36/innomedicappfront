import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../services/login.service';
import { LoginModel } from '../../models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userData: LoginModel = {
    dni: '',
    password: ''
  };

  miFormulario: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.minLength(8)]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: LoginService,
    private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    const {dni, password} = this.miFormulario.value;

    this.userData.dni = dni;
    this.userData.password = password;

    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere, por favor...',
    });
    Swal.showLoading();
    this.auth.login(this.userData).subscribe(resp => {
      Swal.close();
      this.router.navigateByUrl('/intranet').then(() => {
        window.location.reload();
      });
    }, (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar',
        text: err.error
      });
    });
  }

  campoNoValido(campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }
}
