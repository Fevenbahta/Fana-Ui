import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminAuthAdminGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      console.log("roe",this.authService.getres().role) 
       if (this.authService.getres().role == "Admin") {
  
      return true;
    } 
    else {
      // Redirect to ItComponent for non-admin users
      console.log("roleee",this.authService.getres())
      this.router.navigate(['user/:id/It']);
      return false;
    }
    
  }
}
