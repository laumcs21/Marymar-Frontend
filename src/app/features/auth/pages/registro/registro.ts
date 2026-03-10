import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
import { environment } from '../../../../../environments/environment';
import { ViewChild } from '@angular/core';
import { RecaptchaComponent } from 'ng-recaptcha';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RecaptchaModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('captchaRef') captcha!: RecaptchaComponent;

  form!: FormGroup;
  serverError: string | null = null;
  mostrarPassword = false;
  formEnviado=false;
  mostrarReglasPassword=false;
  cumpleLongitud = false;
  cumpleMayuscula = false;
  cumpleMinuscula = false;
  cumpleNumero = false;
  cumpleSimbolo = false;
  tipoInputPassword: string = 'text';
  siteKey = environment.recaptchaSiteKey;
  captchaToken: string | null = null;
  fechaMaxima: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  onCaptchaResolved(token: string | null) {
  this.captchaToken = token;
  this.form.get('captcha')?.setValue(token);
}

  ngOnInit(): void {

    this.form = this.fb.group({
      numeroIdentificacion: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
      ]],
      fechaNacimiento: [
        '',
        [Validators.required, this.fechaNoFuturaValidator]
      ],
      direccionEnvio: ['', Validators.required],
      aceptaHabeasData: [false, Validators.requiredTrue],
      captcha: ['', Validators.required]
    });

    this.form.get('contrasena')?.valueChanges.subscribe(valor => {

      const value = valor || '';

      this.cumpleLongitud = value.length >= 6;
      this.cumpleMayuscula = /[A-Z]/.test(value);
      this.cumpleMinuscula = /[a-z]/.test(value);
      this.cumpleNumero = /\d/.test(value);
      this.cumpleSimbolo = /[^A-Za-z\d]/.test(value);

    });
  }

  private fechaNoFuturaValidator(control: AbstractControl): ValidationErrors | null {

    if (!control.value) return null;

    const fecha = new Date(control.value);
    const hoy = new Date();

    return fecha > hoy ? { fechaFutura: true } : null;
  }

registrar() {

  this.formEnviado = true;

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  console.log("TOKEN CAPTCHA FRONT:", this.captchaToken);
  const payload = {
    ...this.form.value,
    rol: 'CLIENTE',
    captchaToken: this.captchaToken
  };

  this.authService.registro(payload).subscribe({

    next: () => {
      this.router.navigate(['/login']);
    },

    error: (err) => {
      this.resetCaptcha();
      console.log(err);

      let mensaje = '';

      if (err.error) {
        if (typeof err.error === 'string') {
          mensaje = err.error;
        } else if (err.error.message) {
          mensaje = err.error.message;
        }
      }

      mensaje = mensaje || 'Error al registrar usuario';

      if (mensaje.toLowerCase().includes('correo')) {
        this.form.get('email')?.setErrors({ duplicado: true });
      }

      if (mensaje.toLowerCase().includes('identificación')) {
        this.form.get('numeroIdentificacion')?.setErrors({ duplicado: true });
      }

      this.serverError = mensaje;
    }

  });
}
  irALogin() {
    this.router.navigate(['/login']);
  }

  tieneMayuscula(): boolean {
  const value = this.form.get('contrasena')?.value || '';
  return /[A-Z]/.test(value);
}

tieneMinuscula(): boolean {
  const value = this.form.get('contrasena')?.value || '';
  return /[a-z]/.test(value);
}

tieneNumero(): boolean {
  const value = this.form.get('contrasena')?.value || '';
  return /\d/.test(value);
}

tieneSimbolo(): boolean {
  const value = this.form.get('contrasena')?.value || '';
  return /[^A-Za-z\d]/.test(value);
}

tieneLongitud(): boolean {
  const value = this.form.get('contrasena')?.value || '';
  return value.length >= 6;
}

activarPassword() {
  if (this.tipoInputPassword !== 'password') {
    this.tipoInputPassword = 'password';
  }
}

togglePassword() {

  this.mostrarPassword = !this.mostrarPassword;

  this.tipoInputPassword = this.mostrarPassword ? 'text' : 'password';
}

ocultarReglasConDelay() {
  setTimeout(() => {
    this.mostrarReglasPassword = false;
  }, 150);
}

resetCaptcha() {
  if (this.captcha) {
    this.captcha.reset();
  }

  this.captchaToken = null;
  this.form.get('captcha')?.reset();
}
}