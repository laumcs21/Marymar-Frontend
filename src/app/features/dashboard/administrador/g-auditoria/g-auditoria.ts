import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditoriaService, Auditoria } from '../../../../core/services/auditoria.service';

@Component({
  selector: 'app-g-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './g-auditoria.html',
  styleUrls: ['./g-auditoria.css']
})
export class GAuditoriaComponent implements OnInit {

  logs: Auditoria[] = [];
  logsFiltrados: Auditoria[] = [];

  filtros = {
    usuario: '',
    accion: '',
    entidad: '',
    fechaInicio: '',
    fechaFin: ''
  };

  cargando = false;

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit(): void {
    this.cargarLogs();
  }

  cargarLogs() {
    this.cargando = true;

    this.auditoriaService.obtenerTodos().subscribe(data => {
      this.logs = data;
      this.logsFiltrados = data;
      this.cargando = false;
    });
  }

  aplicarFiltros() {
    this.cargando = true;

    this.auditoriaService.filtrar(this.filtros).subscribe(data => {
      this.logsFiltrados = data;
      this.cargando = false;
    });
  }

  limpiarFiltros() {
    this.filtros = {
      usuario: '',
      accion: '',
      entidad: '',
      fechaInicio: '',
      fechaFin: ''
    };

    this.cargarLogs();
  }
}