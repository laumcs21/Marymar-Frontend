import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente.html',
  styleUrls: ['./cliente.css'],
})
export class ClienteComponent implements OnInit {

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