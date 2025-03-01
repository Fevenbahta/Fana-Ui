import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ReportAuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.getres().role == "Finance"||this.authService.getres().role == "0078"||this.authService.getres().role == "0017"||this.authService.getres().role == "0041"||this.authService.getres().role == "0048"||this.authService.getres().role == "0049") {
  
      return true;
    } 
    else {
      // Redirect to ItComponent for non-admin users
      this.router.navigate(['user/:id/It']);
      return false;
    }
    
  }
}
