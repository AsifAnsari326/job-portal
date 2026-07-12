import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login {
  loginForm!: any;

  constructor(private fb :FormBuilder) {}
  
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
};
};
