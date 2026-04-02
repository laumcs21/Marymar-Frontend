import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterModule],
  templateUrl: './administrador.html',
  styleUrls: ['./administrador.css'],
})
export class AdminComponent implements OnInit {

  rol!: string | null;

  constructor(private router: Router, private authService: AuthService
  ) {}

  ngOnInit() {
    this.rol = localStorage.getItem('rol');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}