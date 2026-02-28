import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})

export class ForgotPasswordComponent {

form!: FormGroup;
mensaje = '';
error = '';

constructor(
  private fb: FormBuilder,
  private authService: AuthService,
  private router: Router
) {}

ngOnInit() {
  this.form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
}

enviar() {

  if (this.form.invalid) return;

  this.authService.forgotPassword(this.form.value.email)
    .subscribe({
      next: () => {
        this.mensaje = 'Si el correo existe, te enviamos un enlace.';
        this.error = '';
      },
      error: err => {
        this.error = err.error?.message || 'Error enviando correo';
      }
    });
}

volverLogin() {
  this.router.navigate(['/login']);
}

}