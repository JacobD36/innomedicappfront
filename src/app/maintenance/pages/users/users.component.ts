import { Component, OnInit, OnDestroy, Injectable, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerI18n, NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../services/users.service';
import { UsersResponse } from '../../../models/users_response.model';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ValidatorService } from '../../../shared/services/validator.service';
import { Globals } from '../../../shared/globals';

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
  @ViewChild('usrLstForm') usrLstForm!: NgForm;

  usersForm: FormGroup = this.fb.group({
    f_ini: [''],
    f_fin: [''],
    txtToSeek: ['']
  });

  usuarios: UsersResponse[] = [];
  usersSubscription!: Subscription;
  f_ini!: string;
  f_fin!: string;

  initForm = {
    f_ini: '',
    f_fin: '',
    txtToSeek: ''
  }

  constructor(
    private usersService: UsersService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<String>,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    public globals: Globals
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.globals.isLoading = true;
    this.getUsersList('', '1', '', '');
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  seekForUsers() {
    const fech_ini: string = this.usersForm.get('f_ini')?.value || '';
    const fech_fin: string = this.usersForm.get('f_fin')?.value || '';

    if(this.initForm.f_ini == null) {this.initForm.f_ini = '';}
    if(this.initForm.f_fin == null) {this.initForm.f_fin = '';}

    if((fech_ini != '' && fech_fin == '') || (fech_ini == '' && fech_fin != '')) {
      Swal.fire({
        icon: 'error',
        title: '¡No se ingresó una fecha!',
        text: 'Por favor, complete los campos Fecha Inicial y Fecha Final si realiza el filtro por fechas.'
      });
    } else {
      if(fech_ini != '' && !this.validDate(fech_ini)) {
        Swal.fire({
          icon: 'error',
          title: '¡Fecha inválida!',
          text: 'Por favor, ingrese una fecha válida.'
        });
        return;
      }
      if(fech_fin != '' && !this.validDate(fech_fin)) {
        Swal.fire({
          icon: 'error',
          title: '¡Fecha inválida!',
          text: 'Por favor, ingrese una fecha válida.'
        });
        return;
      }
      this.globals.isLoading = true;
      this.getUsersList(this.usersForm.get('txtToSeek')?.value, '1', fech_ini, fech_fin);
    }
  }

  getUsersList(search: string, page: string, f_ini: string, f_fin: string) {
    this.usersSubscription = this.usersService.userList(search, page, f_ini, f_fin).subscribe(resp => {
      this.globals.isLoading = false;
      this.usuarios = resp;
    });
  }

  usersLength() : boolean {
    if(this.usuarios != null) {
      return (this.usuarios.length <= 0 ) ? true : false;
    }
    return true;
  }

  validDate(fech: string): boolean {
    let res: boolean = false;
    let f_part = fech.split('-');
    if(f_part.length == 3) {res = true;}
    return res;
  }

  invalidField(field: string) {
    return this.usersForm.get(field)?.invalid && this.usersForm.get(field)?.touched;
  }

  open(content: any) {
    this.modalService.open(content);
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }
}
