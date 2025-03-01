import { Component } from '@angular/core';
import { Login } from 'app/models/data.model';
import { AuthGuardService } from 'app/service/auth-guard.service';
import { AuthService } from 'app/service/auth.service';
import { LoginService } from 'app/service/login.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  users:Login
  changed:boolean=false;
  showbutton:boolean=true;
  dosntmatch:boolean=false;
  incorrect:boolean=false
  constructor(private authGuardService: AuthGuardService, private authService: AuthService, private userService :LoginService) {}
  buttons = [
   
  ];

  ngOnInit():void {
    this.check();
      }
      check(){
         if (this.authService.getres().role == "Admin") {
      
        return this.showbutton=false;
      }
      }
     
      changePassword(): void {
        
        if (this.newPassword !== this.confirmPassword) {
          console.error('New password and confirm password do not match');
          this.dosntmatch = true;
            setTimeout(() => {
              this.dosntmatch = false;
    
          }, 2000);
          return;
        }
    let userpas=this.authService.getpassword();
    let userid=this.authService.getid();
    let user=this.authService.getres();
        
    
    user.password=this.newPassword
    if( this.newPassword == this.confirmPassword ){
    

         this.userService.updateUser( userid,userpas.toString(),this.oldPassword,user ).subscribe(
          response => {
   
           this. changed= true;
            setTimeout(() => {
              this.changed = false;
    
          }, 1000);
          this.oldPassword=""
          this.newPassword= "";
          this.confirmPassword="";
          },
          error => {
            console.error('Failed to reset password:', error);
            this.incorrect=true;
            setTimeout(() => {
              this.incorrect = false;
    
          }, 1000);
            // Handle error and display error message
          }
        );
    }
     
    }}
    