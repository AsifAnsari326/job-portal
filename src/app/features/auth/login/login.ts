import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
})
export class Login {
  loginForm!: FormGroup;
  formErrorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.formErrorMessage = 'Please correct the highlighted fields.';
      // focus first invalid input
      const firstInvalid: HTMLElement | null = document.querySelector('.form-input--invalid');
      if (firstInvalid && typeof firstInvalid.focus === 'function') {
        firstInvalid.focus();
      }
      return;
    }

    const { email, password } = this.loginForm.value;
    this.formErrorMessage = '';
    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.router.navigate(['/jobs']);
      },
      error: (err) => console.error('Login failed', err),
    });
  }
}
