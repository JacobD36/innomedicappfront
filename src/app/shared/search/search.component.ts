import { Component, Injectable, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { SearchModel } from '../../models/search.model';
import { UtilsService } from '../services/utils.service';

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
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class SearchComponent implements OnInit, OnDestroy {
  @Output() onNewSearch: EventEmitter<SearchModel> = new EventEmitter<SearchModel>();

  searchResult!: SearchModel;

  dataForm: FormGroup = this.fb.group({
    f_ini: [''],
    f_fin: [''],
    txtToSeek: ['']
  });

  constructor(
    private fb: FormBuilder,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
  }

  seekForData() {
    const fech_ini: string = this.dataForm.get('f_ini')?.value || '';
    const fech_fin: string = this.dataForm.get('f_fin')?.value || '';

    this.searchResult = {
      f_ini: fech_ini,
      f_fin: fech_fin,
      txtToSeek: this.dataForm.get('txtToSeek')?.value || '',
    }

    if((fech_ini != '' && fech_fin == '') || (fech_ini == '' && fech_fin != '')) {
      Swal.fire({
        icon: 'error',
        title: '¡No se ingresó una fecha!',
        text: 'Por favor, complete los campos Fecha Inicial y Fecha Final si realiza el filtro por fechas.'
      });
    } else {
      if(fech_ini != '' && !this.utilsService.validDate(fech_ini)) {
        Swal.fire({
          icon: 'error',
          title: '¡Fecha inválida!',
          text: 'Por favor, ingrese una fecha válida.'
        });
        return;
      }
      if(fech_fin != '' && !this.utilsService.validDate(fech_fin)) {
        Swal.fire({
          icon: 'error',
          title: '¡Fecha inválida!',
          text: 'Por favor, ingrese una fecha válida.'
        });
        return;
      }
      this.onNewSearch.emit(this.searchResult);
    }
  }

  cleanData() {
    this.dataForm.setValue({
      f_ini: '',
      f_fin: '',
      txtToSeek: ''
    });
  }

  ngOnDestroy(): void {
    
  }

}
