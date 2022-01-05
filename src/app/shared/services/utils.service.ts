import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  //Valida un formato de fecha
  validDate(fech: string): boolean {
    let res: boolean = false;
    let f_part = fech.split('-');
    if(f_part.length == 3) {res = true;}
    return res;
  }

  //Valida la entrada sólo de números
  restrictNumeric(e: any) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
     return false;
    }
    if (e.which === 0) {
     return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
   }
}
