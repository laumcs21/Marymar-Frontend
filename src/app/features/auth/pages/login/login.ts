import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { RecaptchaModule } from 'ng-recaptcha';
import { ViewChild } from '@angular/core';
import { RecaptchaComponent } from 'ng-recaptcha';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RecaptchaModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {

    @ViewChild('captchaRef') captcha!: RecaptchaComponent;

  error: string | null=null
  mostrarCaptcha = false;
  captchaToken: string | null = null; 
  siteKey = environment.recaptchaSiteKey;

  form = new FormGroup({
    email: new FormControl(''),
    contrasena: new FormControl('')
  });

  ngOnInit() {
  this.form.reset();
}

  constructor(private auth: AuthService, private router: Router) {}

  mostrarPassword = false;
  
submit() {
  this.error = null;
  const { email, contrasena} = this.form.value;
  const captcha = this.captchaToken!;

  if (!this.captchaToken) {
  this.error = "Completa el captcha";
  return;
}

  this.auth.login(email!, contrasena!, captcha)
    .subscribe({
      next: (res) => {
        sessionStorage.setItem('2fa_email', email!);

        this.router.navigate(['/verify-code']);
      },
    error: (err) => {
            this.resetCaptcha();
            this.form.patchValue({ contrasena: '' });

      console.log(err);

      if (err.error?.error) {
        this.error = err.error.error;
      } else if (typeof err.error === 'string') {
        this.error = err.error;
      } else {
        this.error = 'Correo o contraseña incorrectos';
      }
    }
    });
}

irARegistro(){
  this.router.navigate(['/registro']);
}

loginWithGoogle() {
  window.location.href = `${environment.backendUrl}/oauth2/authorization/google`;
}

irARecuperar() {
  this.router.navigate(['/recuperar-password']);
}

captchaResuelto(token: string | null) {
  this.captchaToken = token;
}

resetCaptcha() {
  if (this.captcha) {
    this.captcha.reset();
  }

  this.captchaToken = null;
}
}