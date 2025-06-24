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
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;

  constructor(private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit() {
    console.log('OnInit Component');
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
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
          localStorage.setItem('identity', JSON.stringify(identity));

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
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
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

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    //mostrar los formularios 
    this.identity = null;
    this.token = null;
  }

  onSubmitRegister() {
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con '+ this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        var alertRegister = <any>error;
        if (alertRegister != null) {
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
  }

  
}
