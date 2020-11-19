import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../mpg-client/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  constructor(private fb: FormBuilder, private user: UserService) {}
  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get email() {
    return this.loginForm.get('email').value;
  }

  get password() {
    return this.loginForm.get('password').value;
  }

  onSubmit() {
    this.isLoading = true;
    this.user.email = this.email;
    this.user.password = this.password;

    const token$ = this.user.token;
    token$.subscribe((token) =>
      forkJoin({
        user: this.user.getUserInfoFromToken(token),
        leagues: this.user.getLeagueInfoFromToken(token),
      }).subscribe(({ user, leagues }) => {
        this.user.user$.next(user);
        this.user.leagues$.next(leagues);
        this.isLoading = false;
      })
    );
  }
}
