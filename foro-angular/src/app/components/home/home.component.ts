import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {
  public page_title: string;
  public identity;

  constructor(
    private _userService: UserService,
  ) {
    this.page_title = 'Bienvenido al foro de programación';
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(): void {
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

}
