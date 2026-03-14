import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../../../../src/environments/environment'
import { ProductoInsumo, ProductoInsumoCreateDTO } from '../models/productoInsumo.model'

@Injectable({
  providedIn:'root'
})
export class ProductoInsumoService{

  private url = environment.apiUrl + '/producto-insumo'

  constructor(private http:HttpClient){}

  listar(productoId:number){

    return this.http.get<ProductoInsumo[]>(
      `${this.url}/producto/${productoId}`
    )

  }

  crear(dto:ProductoInsumoCreateDTO){

    return this.http.post(
      this.url,
      dto
    )

  }

  actualizarCantidad(id:number, cantidad:number){

    return this.http.put(
      `${this.url}/${id}?cantidad=${cantidad}`,
      {}
    )

  }

  eliminar(id:number){

    return this.http.delete(
      `${this.url}/${id}`
    )

  }

}