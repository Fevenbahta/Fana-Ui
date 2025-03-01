
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
  { path: '/Approval', title: 'Approve', icon: 'check_circle', class: '' },
  { path: '/FanaReport', title: 'Fana-Report', icon: 'assessment', class: '' },
  { path: '/BranchReport', title: 'Branch-Report', icon: 'business', class: '' },
  { path: '/Request', title: 'Request', icon: 'playlist_add', class: '' },
  { path: '/IfrsApproval', title: 'RTGS-Approve', icon: 'thumb_up', class: '' },
  { path: '/RtgsReport', title: 'RTGS and ATM-Report', icon: 'bar_chart', class: '' },
  { path: '/IfrsRequest', title: 'RTGS-Request', icon: 'send', class: '' },
  { path: '/RtgsAllReport', title: 'Rtgs-Atm All Receipt', icon: 'insights', class: '' },
  { path: '/Change', title: 'Change', icon: 'edit', class: '' },
  { path: '/FanaCustom', title: 'Fana-Customer-Report', icon: 'description', class: '' },
  { path: '/FanaStatment', title: 'Fana-Account-Statement', icon: 'account_balance_wallet', class: '' },
  
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
   
this.user= this.authService.getres().userName;
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    if (true) {
   
       this.display=true; // Allow navigation to /user/:id if user is authenticated
     }

     if (this.role === '0041' || this.role === '0048' || this.role === '0049') {
      this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/Approval' || menuItem.path === '/BranchReport'||
 menuItem.path === '/RtgsReport');
  
    }
     else if (this.role === '0052'||this.role === '0073') {
      this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/Request');
   
  } else if ( this.role==='0078'||this.role === '0017') {  
     this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/FanaReport' ||menuItem.path === '/RtgsAllReport');}
   
     else if (this.role === 'Admin' ) {
  this.menuItems = []; // Display no routes for Admin
}
else if ( this.role==='FanaAdmin') {  
  this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/FanaCustom'||menuItem.path === '/FanaStatment');}

  
  else if ( this.role==='Finance') {  
    this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/RtgsAllReport' )}
  
    }
  
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
