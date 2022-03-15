import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../services/users.service';
import { UsersResponse } from '../../../models/users_response.model';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ValidatorService } from '../../../shared/services/validator.service';
import { Globals } from '../../../shared/globals';
import { tap } from 'rxjs/operators';
import { LoginService } from '../../../auth/services/login.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { UtilsService } from '../../../shared/services/utils.service';
import { SearchModel } from 'src/app/models/search.model';

const I18N_VALUES = {
  'es': {
    weekdays: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    weekLabel: 'sem'
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language: string = 'es';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(private _i18n: I18n) { super(); }

  getWeekdayLabel(weekday: number): string { return I18N_VALUES['es'].weekdays[weekday - 1]; }
  getWeekLabel(): string { return I18N_VALUES['es'].weekLabel; }
  getMonthShortName(month: number): string { return I18N_VALUES['es'].months[month - 1]; }
  getMonthFullName(month: number): string { return this.getMonthShortName(month); }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.day}-${date.month}-${date.year}`; }
}

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
 @Injectable()
 export class CustomAdapter extends NgbDateAdapter<string> {
 
   readonly DELIMITER = '-';
 
   fromModel(value: string | null): NgbDateStruct | null {
     if (value) {
       let date = value.split(this.DELIMITER);
       return {
         day : parseInt(date[0], 10),
         month : parseInt(date[1], 10),
         year : parseInt(date[2], 10)
       };
     }
     return null;
   }
 
   toModel(date: NgbDateStruct | null): string | null {
     return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
   }
 }

 /**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [
    NgbModalConfig,
    NgbModal,
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class UsersComponent implements OnInit, OnDestroy {
  newUserForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.minLength(8)]],
    perfil: ['', [Validators.required]],
    nombre1: ['', [Validators.required]],
    nombre2: [''],
    apellido1: ['', [Validators.required]],
    apellido2: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]],
    fech_nac: ['', [Validators.required]]
  });

  searchResult!: SearchModel;

  usuarios: UsersResponse[] = [];
  usersSubscription!: Subscription;
  newUserSubscription!: Subscription;
  f_ini!: string;
  f_fin!: string;
  count!: number;
  page: number = 1;

  isSaving: boolean = false;

  newUser!: User;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    public globals: Globals,
    private authService: LoginService,
    private router: Router,
    public utilsService: UtilsService
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.globals.showMenu = 'users';
    this.globals.isLoading = true;
    this.searchResult = {
      f_ini: '',
      f_fin: '',
      txtToSeek: ''
    }
    this.getUsersList('', '1', '', '');
  }


  seekForUsers(search: SearchModel) {
    this.searchResult = search;
    this.globals.isLoading = true;
    this.getUsersList(search.txtToSeek, '1', search.f_ini, search.f_fin);
  }

  getUsersList(search: string, page: string, f_ini: string, f_fin: string) {
    if(this.authService.isAuth()) {
      this.usersSubscription = this.usersService.userList(search, page, f_ini, f_fin).pipe(
        tap(resp => {
          this.usersService.usersCount(search, f_ini, f_fin).subscribe(i => {
            this.count = i;
          });
        })
      ).subscribe(resp => {
        this.globals.isLoading = false;
        this.usuarios = resp;
        this.usuarios.forEach(user => {
          if(!user.name2) {user.name2 = '';}
        });
      }, (err) => {
        this.globals.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: '¡Ha ocurrido un error!',
          text: err.error,
          allowOutsideClick: false
        });
        this.authService.logout();
        this.router.navigateByUrl(`/auth`);
      });
    } else {
      this.authService.logout();
      this.router.navigateByUrl(`/auth`);
      this.globals.isLoading = false;
    }
  }

  usersLength() : boolean {
    if(this.usuarios != null) {
      return (this.usuarios.length <= 0 ) ? true : false;
    }
    return true;
  }

  invalidNewUserField(field: string) {
    return this.newUserForm.get(field)?.invalid && this.newUserForm.get(field)?.touched;
  }

  open(content: any) {
    this.modalService.open(content, {
      size: 'lg'
    });
  }

  close() {
    this.newUserForm.reset();
    this.modalService.dismissAll();
  }

  getPage($event: any) {
    this.globals.isLoading = true;
    this.getUsersList(this.searchResult.txtToSeek, $event, this.searchResult.f_ini, this.searchResult.f_fin);
  }

  saveNewUser() {
    const fech_nac: string = this.newUserForm.get('fech_nac')?.value || '';

    if(this.authService.isAuth()) {
      if(this.utilsService.validDate(fech_nac)) {
        this.isSaving = true;
  
        let bDate = fech_nac.split('-');
        if(bDate[0].length < 2) {bDate[0] = '0'+bDate[0];}
        if(bDate[1].length < 2) {bDate[1] = '0'+bDate[1];}
  
        this.newUser = {
          dni: this.newUserForm.get('dni')?.value,
          email: this.newUserForm.get('email')?.value,
          idProfile: 1,
          status: 1,
          name1: this.newUserForm.get('nombre1')?.value,
          name2: this.newUserForm.get('nombre2')?.value,
          lastName1: this.newUserForm.get('apellido1')?.value,
          lastName2: this.newUserForm.get('apellido2')?.value,
          password: this.newUserForm.get('dni')?.value,
          birthDate: new Date(bDate[2]+'-'+bDate[1]+'-'+bDate[0]+'T05:00:00Z')
        }
        
        this.newUserSubscription = this.usersService.saveNewUser(this.newUser).subscribe(resp => {
          Swal.fire({
            icon: 'success',
            title: '¡Registro grabado con éxito!',
            text: 'Se registró correctamente al usuario con DNI ' + this.newUser.dni,
            allowOutsideClick: false
          }).then(e => {
            this.getUsersList('', '1', '', '');
            //Se limpia formulario de búsqueda
            this.newUserForm.reset();
            this.isSaving = false;
            //this.close();
          });
        }, (err) => {
          this.isSaving = false;
  
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurido un error',
            text: err.error
          });
          return;
        });
      } else {
        this.isSaving = false;
  
        Swal.fire({
          icon: 'error',
          title: '¡Fecha inválida!',
          text: 'Por favor, ingrese una fecha válida.'
        });
        return;
      }
    } else {
      this.authService.logout();
      this.router.navigateByUrl(`/auth`);
    }
  }

  ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
    this.newUserSubscription?.unsubscribe();
  }
}
