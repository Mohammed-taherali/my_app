import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, take, takeUntil } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!
        });
        authService.initializeUser()
        console.log("auth guard, user present", authService.currentUserSig());
        return true;
      } else {
        authService.currentUserSig.set(null);
        console.log("user not found, redirect to login");
        router.navigateByUrl("/login")
        return false;
      }
    })
  );
};
