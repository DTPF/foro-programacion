import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public page_title: string;
  public user: User;
  public identity;
  public token;
  public status;
  public url;
  public afuConfig;
  public message;


  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Ajustes de usuario';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = global.url;
    // console.log(this.url);

    this.afuConfig = {
      multiple: false,
      // formatsAllowed: ".jpg, .jpeg, .png, .gif",
      // allowedMimeType: ['image/JPG'],
      maxSize: "50",
      uploadAPI: {
        url: this.url + 'upload-avatar',
        headers: {
          "Authorization": this._userService.getToken()
        }
      },
      theme: "attachPin",
      hideProgressBar: false,
      hideResetBtn: true,
      hideSelectBtn: false,
      replaceTexts: {
        selectFileBtn: 'Select Files',
        resetBtn: 'Reset',
        uploadBtn: 'Upload',
        dragNDropBox: 'Drag N Drop',
        attachPinBtn: 'Sube tu foto...',
        afterUploadMsg_success: 'Successfully Uploaded !',
        afterUploadMsg_error: 'Upload Failed !',
        sizeLimit: 'Size Limit'
      }
    };

  }

  avatarUpload(data) {

    if (data.body.status == 'error') {
      this.status = 'error';
      this.message = data.body.message;
    } else {
      this.status = 'success';
      this.message = data.body.message;
      this.user.image = data.body.user.image;
    }
  }


  ngOnInit(): void {
  }

  onSubmit(form) {
    this._userService.update(this.user).subscribe(
      response => {
        if(!response.user){
          this.status = 'error';
          this.message = response.message;
        }else{
          this.status = 'success';
          // console.log(response);
          this.message = response.message;
          localStorage.setItem('identity', JSON.stringify(this.user));
        }
      },
      error => {
        this.status = 'error';
        console.log(error);
      }
    );
  }

}
