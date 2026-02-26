import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterModule],
  templateUrl: './administrador.html',
  styleUrls: ['./administrador.css'],
})
export class AdminComponent implements OnInit {

  rol!: string | null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.rol = localStorage.getItem('rol');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}