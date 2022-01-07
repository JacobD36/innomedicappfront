import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SearchModel } from '../../../models/search.model';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  searchResult!: SearchModel;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  searchPersonal(result: SearchModel) {
    console.log(result);
  }

}
