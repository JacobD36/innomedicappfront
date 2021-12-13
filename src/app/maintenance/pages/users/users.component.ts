import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { UsersResponse } from '../../../models/users_response.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  usuarios: UsersResponse[] = [];
  usersSubscription!: Subscription;

  constructor(
    private usersService: UsersService
  ) { 
  }

  ngOnInit(): void {
    this.getUsersList();
  }

  async getUsersList() {
    this.usersSubscription = await this.usersService.userList().subscribe(resp => {
      this.usuarios = resp;
    });
  }

  usersLength() : boolean {
    return (this.usuarios.length <= 0 ) ? true : false;
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

}
