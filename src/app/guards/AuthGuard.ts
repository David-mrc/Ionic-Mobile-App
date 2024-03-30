import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { map, take } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

export const AuthGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$!.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['']);
        return false;
      }
    }
    ));
}

export const LoggedGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$!.pipe(
    take(1),
    map(user => {
      if (user) {
        router.navigate(['/topics']);
        return false;
      } else {
        return true;
      }
    }
    ));
}
