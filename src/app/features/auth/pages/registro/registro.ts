import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RecaptchaModule, RecaptchaComponent } from 'ng-recaptcha';
import { environment } from '../../../../../environments/environment';
import { ChangeDetectorRef } from '@angular/core';

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
  formEnviado = false;
  mostrarReglasPassword = false;

  cumpleLongitud = false;
  cumpleMayuscula = false;
  cumpleMinuscula = false;
  cumpleNumero = false;
  cumpleSimbolo = false;

  tipoInputPassword: string = 'text';
  siteKey = environment.recaptchaSiteKey;
  captchaToken: string | null = null;
  fechaMaxima: string = new Date().toISOString().split('T')[0];

  mostrarAyudaIdentificacion = false;
  mostrarModalExito = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cdr:ChangeDetectorRef
  ) {}

  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
    this.form.get('captcha')?.setValue(token);
  }

  ngOnInit(): void {

    this.form = this.fb.group({
numeroIdentificacion: [
  '',
  [
    Validators.required,
    Validators.pattern(/^\d+$/),
    Validators.maxLength(15)
  ]
],
     nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
      ]],
      fechaNacimiento: ['', [Validators.required, this.fechaNoFuturaValidator]],
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
    this.serverError = null;

    this.form.markAllAsTouched();

    if (!this.captchaToken) {
      this.form.get('captcha')?.markAsTouched();
    }

    if (this.form.invalid) {
      return;
    }

    const payload = {
      ...this.form.value,
      rol: 'CLIENTE',
      captchaToken: this.captchaToken
    };

    this.authService.registro(payload).subscribe({

      next: () => {

        console.log("Entró al success");
        this.mostrarModalExito = true;
        this.cdr.detectChanges();
        this.form.reset();
        this.formEnviado = false;
        this.resetCaptcha();
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

  // 🔥 NUEVO
  irALoginDesdeModal() {
    this.mostrarModalExito = false;
    this.router.navigate(['/login']);
  }

  irALogin() {
    this.router.navigate(['/login']);
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

  bloquearNoNumeros(event: KeyboardEvent) {
  if (
    ['e', 'E', '+', '-', '.'].includes(event.key) ||
    (isNaN(Number(event.key)) && event.key !== 'Backspace')
  ) {
    event.preventDefault();
  }
}

limpiarNoNumeros() {
  const control = this.form.get('numeroIdentificacion');
  if (!control) return;

  const limpio = control.value?.replace(/\D/g, '').slice(0, 15);
  control.setValue(limpio, { emitEvent: false });
}
}