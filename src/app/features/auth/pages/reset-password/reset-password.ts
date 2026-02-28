import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})

export class ResetPasswordComponent implements OnInit{



form!: FormGroup;
token!: string;
error = '';
mensaje = '';

constructor(
  private fb: FormBuilder,
  private route: ActivatedRoute,
  private authService: AuthService,
  private router: Router
) {}

mostrarNueva = false;
mostrarConfirm = false;

ngOnInit() {

  this.token = this.route.snapshot.queryParamMap.get('token') || '';

this.form = this.fb.group({
  newPassword: ['', [
    Validators.required,
    Validators.minLength(6),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
  ]],
  confirmPassword: ['', Validators.required]
}, { validators: this.passwordsMatch });
}

cambiar() {
  console.log("CLICK FUNCIONA");
  console.log("TOKEN:", this.token);

  if (this.form.invalid) return;

  if (this.form.value.newPassword !== this.form.value.confirmPassword) {
    this.error = 'Las contraseñas no coinciden';
    return;
  }

  this.authService.resetPassword(this.token, this.form.value.newPassword)
    .subscribe({
      next: () => {
        this.mensaje = 'Contraseña actualizada correctamente';
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        this.error = err.error?.message || 'Token inválido o expirado';
      }
    });
}

passwordsMatch(form: FormGroup) {
  const pass = form.get('newPassword')?.value;
  const confirm = form.get('confirmPassword')?.value;

  return pass === confirm ? null : { noCoinciden: true };
}
}