import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;
  serverError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

    mostrarPassword = false;


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
      fechaNacimiento: ['', Validators.required],
      direccionEnvio: ['', Validators.required],
    });
  }

  registrar() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.value,
      rol: 'CLIENTE'   
    };

    this.authService.registro(payload).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.serverError = err.error?.message || 'Error al registrar usuario';
      }
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  registroConGoogle() {
    console.log('Registro con Google');
  }
}