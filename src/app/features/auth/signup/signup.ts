import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth'; 


function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
  standalone: true,
})
export class Signup {
  signupForm!: FormGroup;
  formErrorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: Auth) {}


  ngOnInit() {
    this.signupForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordsMatch });
  }

  get fullname() {return this.signupForm.get('fullname')}
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.formErrorMessage = 'Please correct the highlighted fields.';
      const firstInvalid: HTMLElement | null = document.querySelector('.form-input--invalid');
      if (firstInvalid && typeof firstInvalid.focus === 'function') {
        firstInvalid.focus();
      }
      return;
    }

    const { fullname, email, password } = this.signupForm.value;
    this.authService.signup(fullname!, email!, password!).subscribe({
      next: () => {
        this.router.navigate(['/jobs']);
      },
      error: (err) => console.error('Signup failed', err),
    });
  }
}
