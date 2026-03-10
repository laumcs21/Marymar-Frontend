import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-code.html',
  styleUrl: './verify-code.css',
})
export class VerifyCode implements OnInit, OnDestroy {

  private platformId = inject(PLATFORM_ID);

  form = new FormGroup({
    codigo: new FormControl('')
  });

  formattedTime: string = '';
  expired: boolean = false;
  loadingVerify: boolean = false;
  loadingResend = false;
  private timeLeft: number = 300;
  private interval: any;
  message: string = '';
 errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  // ==========================
  // 🔐 Helper seguro SSR
  // ==========================

  private getEmail(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('2fa_email');
    }
    return null;
  }

  private removeEmail(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('2fa_email');
    }
  }

  // ==========================
  // 🔄 Lifecycle
  // ==========================

  ngOnInit() {

    const email = this.getEmail();

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    this.startTimer();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  // ==========================
  // ✅ Verificar código
  // ==========================

  verify() {

    const email = this.getEmail();
    const codigo = this.form.value.codigo;

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    if (!codigo) {
      alert('Ingrese el código');
      return;
    }

    if (this.loadingVerify) return;
    this.loadingVerify = true;

    this.auth.validateCode(email, codigo)
      .subscribe({
        next: (res) => {

          this.removeEmail();

          switch (res.rol) {
            case 'ADMINISTRADOR':
              this.router.navigate(['/dashboard/administrador']);
              break;

            case 'CLIENTE':
              this.router.navigate(['/dashboard/cliente']);
              break;

            case 'MESERO':
              this.router.navigate(['/dashboard/mesero']);
              break;
          }
        },
        error: () => {
          this.errorMessage = 'Código incorrecto';
        }
      });

      this.loadingVerify = false;
  }

  // ==========================
  // 🔁 Reenviar código
  // ==========================
resendCode() {

  if (this.loadingResend) return;

  if (this.loadingResend) return;
  this.loadingResend = true;

  const email = this.getEmail(); 

  if (!email) {
    this.router.navigate(['/login']);
    return;
  }

  this.loadingResend = true;

this.auth.resendCode(email).subscribe({
  next: () => {

    this.form.reset();

    clearInterval(this.interval);
    this.startTimer();

    this.expired = false;
    this.loadingResend = false;

    this.message = 'Nuevo código enviado';
    this.errorMessage = '';

  },
  error: () => {

    this.loadingResend = false;

    this.errorMessage = 'Error al reenviar el código';
    this.message = '';
  }
});
}

  // ==========================
  // ⏱ Temporizador
  // ==========================

  startTimer() {

    this.timeLeft = 300;
    this.updateFormattedTime();

    this.interval = setInterval(() => {

      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateFormattedTime();
      } else {
        this.expired = true;
        clearInterval(this.interval);
      }

    }, 1000);
  }

  private updateFormattedTime() {

    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;

    this.formattedTime =
      `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  backToLogin() {
  sessionStorage.removeItem('2fa_email');
  this.router.navigate(['/login']);
}
}