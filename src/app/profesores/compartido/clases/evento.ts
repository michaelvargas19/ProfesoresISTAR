import { Producto } from "./producto";

export class Evento extends Producto{

    nombre: string;
    tipoEvento: string;
    ambito: string;
    ciudad: string;
    fechaInicio: Date;
    fechaFin: Date;
    resumen: string;
    productos: Producto [];
    url: string;

    contructor(){
        this.productos = [];
    }
}
