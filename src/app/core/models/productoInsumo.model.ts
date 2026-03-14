export interface ProductoInsumo {

  id:number

  productoId:number
  productoNombre:string

  insumoId:number
  insumoNombre:string

  cantidad:number

}

export interface ProductoInsumoCreateDTO{

  productoId:number
  insumoId:number
  cantidad:number

}