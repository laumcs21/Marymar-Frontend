import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {

  form = new FormGroup({
    email: new FormControl(''),
    contrasena: new FormControl('')
  });

  ngOnInit() {
  this.form.reset();
}

  constructor(private auth: AuthService, private router: Router) {}

submit() {

  const { email, contrasena } = this.form.value;

  this.auth.login(email!, contrasena!)
    .subscribe({
      next: (res) => {
        sessionStorage.setItem('2fa_email', email!);

        this.router.navigate(['/verify-code']);
      },
      error: (err) => {
        console.error('Error login:', err);
      }
    });
}

loginWithGoogle() {
  window.location.href = `${environment.apiUrl}/oauth2/authorization/google`;
}
}