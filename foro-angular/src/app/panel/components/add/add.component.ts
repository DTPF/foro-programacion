import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Topic } from '../../../models/topic';
import { UserService } from '../../../services/user.service';
import { TopicService } from '../../../services/topic.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [UserService, TopicService]
})
export class AddComponent implements OnInit {
  public page_title: string;
  public topic: Topic;
  public identity;
  public token;
  public status;
  public message;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _topicService: TopicService
  ) {
    this.page_title = 'Crea nuevo tema';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.topic = new Topic('', '', '', '', '', '', this.identity._id, null);
  }

  ngOnInit(): void {
    // console.log(this._topicService.prueba());
  }

  onSubmit(form) {
    this._topicService.addTopic(this.token, this.topic).subscribe(
      response => {
        if (response.topic) {
          this.status = 'success';
          this.message = 'El tema se ha creado correctamente';
          this.topic = response.topic;
          this._router.navigate(['/panel/listado']);
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(error);
      }
    )
  }

}
