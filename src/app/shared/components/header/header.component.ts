import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();


  constructor(private authService: AuthService) { }
  display:boolean=false
  ngOnInit() { 
    
    if (this.authService.Role) {
      console.log("user admin") 
       this.display=true; // Allow navigation to /user/:id if user is authenticated
    }
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
  }
  logout(){
    this.authService.logout()
  }
}