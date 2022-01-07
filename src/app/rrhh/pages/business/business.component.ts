import { Component, Injectable, OnInit, OnDestroy } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SearchModel } from 'src/app/models/search.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessResponse } from 'src/app/models/business.model';
import { Subscription } from 'rxjs';
import { RrhhService } from '../services/rrhh.service';
import { Globals } from 'src/app/shared/globals';
import { LoginService } from '../../../auth/services/login.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../../shared/services/utils.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

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
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css'],
  providers: [
    NgbModalConfig,
    NgbModal,
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class BusinessComponent implements OnInit {
  searchResult!: SearchModel;

  newBusinessForm: FormGroup = this.fb.group({
    ruc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    razon: ['', [Validators.required, Validators.minLength(6)]],
    descripcion: ['']
  });

  businessList: BusinessResponse[] = [];
  business!: BusinessResponse;
  businessSuscription!: Subscription;
  newBusinessSuscription!: Subscription;
  count!: number;
  page: number = 1;

  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    private rrhhService: RrhhService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    public globals: Globals,
    public authService: LoginService,
    private router: Router,
    public utilsService: UtilsService,
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.globals.isLoading = true;
    this.searchResult = {
      f_ini: '',
      f_fin: '',
      txtToSeek: ''
    }
    this.getBusinessList('', '1', '', '');
  }

  searchBusiness(search: SearchModel) {
    this.searchResult = search;
    this.globals.isLoading = true;
    this.getBusinessList(search.txtToSeek, '1', search.f_ini, search.f_fin);
  }

  getBusinessList(search: string, page: string, f_ini: string, f_fin: string) {
    if(this.authService.isAuth()) {
      this.newBusinessSuscription = this.rrhhService.businessList(search, page, f_ini, f_fin).pipe(
        tap(resp => {
          this.rrhhService.businessCount(search, f_ini, f_fin).subscribe(i => {
            this.count = i;
          });
        })
      ).subscribe(resp => {
        this.globals.isLoading = false;
        this.businessList = resp;
        this.businessList.forEach(business => {
          if(!business.description) {business.description = '';}
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
        this.router.navigateByUrl('/auyh');
      });
    } else {
      this.authService.logout();
      this.router.navigateByUrl('/auth');
      this.globals.isLoading = false;
    }
  }

  saveNewBusiness() {
    if(this.authService.isAuth()) {
      this.isSaving = true;

      this.business = {
        razon: this.newBusinessForm.get('razon')?.value,
        status: 1,
        description: this.newBusinessForm.get('descripcion')?.value
      }

      this.newBusinessSuscription = this.rrhhService.saveNewBusiness(this.business).subscribe(resp => {
        Swal.fire({
          icon: 'success',
          title: '¡Registro grabado con éxito',
          text: 'Se registró correctamente la sede',
          allowOutsideClick: false
        }).then(e => {
          this.getBusinessList('', '1', '', '');
          this.newBusinessForm.reset();
          this.isSaving = false;
        });
      }, (err) => {
        this.isSaving = false;

        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: err.error
        });

        return;
      });
    } else {
      this.authService.logout();
      this.router.navigateByUrl('/auth');
    }
  }

  businessLength() : boolean {
    if(this.businessList != null) {
      return (this.businessList.length <= 0 ) ? true : false;
    }
    return true;
  }

  invalidNewUserField(field: string) {
    return this.newBusinessForm.get(field)?.invalid && this.newBusinessForm.get(field)?.touched;
  }

  getPage($event: any) {
    this.globals.isLoading = true;
    this.getBusinessList(this.searchResult.txtToSeek, $event, this.searchResult.f_ini, this.searchResult.f_fin);
  }

  open(content: any) {
    this.modalService.open(content, {
      size: 'lg'
    });
  }

  close() {
    this.newBusinessForm.reset();
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.businessSuscription?.unsubscribe();
    this.newBusinessSuscription?.unsubscribe();
  }
}
