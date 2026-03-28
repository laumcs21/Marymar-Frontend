import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

    private apiUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  pagar(pedidoId: number, metodo: string, monto: number, comprobante?: File) {

    const formData = new FormData();

    formData.append('pedidoId', pedidoId.toString());
    formData.append('metodo', metodo);
    formData.append('monto', monto.toString());

    if (comprobante) {
      formData.append('comprobante', comprobante);
    }

    return this.http.post(this.apiUrl, formData);
  }
}