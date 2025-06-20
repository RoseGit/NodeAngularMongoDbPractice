import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

import { User } from './models/user'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public user: User;
  public identity;
  public token;
  public errorMessage;

  constructor(private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');

  }

  ngOnInit() {
    console.log('OnInit Component');
  }

  public onSubmit() {
    console.log(this.user);

    //conseguir datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          alert('Uusario no esta correctamente identificado');
        } else {
          //crear elemento en el local storage para tener al usuario en sesion 
          //conseguir el token para enviarlo en cada peticion Http 
          this._userService.signup(this.user, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token.length <= 0) {
                alert('El token no se ha generado ');
              } else {
                //crear elemento de storage local
                console.log(token);
                console.log(identity);
              }
            },
            error => {
              var errorMessage = <any>error;
              if (errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );




        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );

  }


}
