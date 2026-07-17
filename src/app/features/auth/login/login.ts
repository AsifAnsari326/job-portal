import { Component } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login {
  loginForm!: any;

  constructor(private fb :FormBuilder, private authService: Auth, private router: Router) {}
  
  ngOnInit() {
  this.loginForm! = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  };

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
 };

 onSubmit() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
 }
 console.log('login form value', this.loginForm.value);
   const { email, password } = this.loginForm.value;
  this.authService.login(email!, password!).subscribe({
    next: (res) => console.log('Auth successful:', res),
    error: (err) => console.error('Login failed', err)
  });
};
};
