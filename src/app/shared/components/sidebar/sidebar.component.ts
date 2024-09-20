
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'app/service/auth.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/Approval', title: 'Approve',  icon: '', class: '' },
    { path: '/FanaReport', title: 'Report',  icon: '', class: '' },
    { path: '/BranchReport', title: 'Report',  icon: '', class: '' },
    { path: '/Request', title: 'Request',  icon: '', class: '' },
    { path: '/Change', title: 'Change',  icon: '', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})



export class SidebarComponent implements OnInit {
  menuItems: any[];
  display:boolean=false;
  role:String=this.authService.getrole();
  constructor(private authService: AuthService) {
    this.menuItems = [];
  }


  
user:String;
  ngOnInit() {
    this.role=this.authService.getrole();
    console.log("side",this.role)
this.user= this.authService.getres().userName;
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    if (true) {
      console.log("user admin") 
       this.display=true; // Allow navigation to /user/:id if user is authenticated
     }

     if (this.role === '0041' || this.role === '0048' || this.role === '0049') {
      this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/Approval' || menuItem.path === '/BranchReport');
    }
     else if (this.role === '0052'||this.role === '0073') {
      this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/Request');
   
  } else if ( this.role==='0078'||this.role === '0017') {  
     this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/FanaReport');}
     else if (this.role === 'Admin' ) {
  this.menuItems = []; // Display no routes for Admin
}
  }
  
  
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
