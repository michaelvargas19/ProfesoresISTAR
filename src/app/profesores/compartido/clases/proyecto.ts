import { Producto } from "./producto";

export class Proyecto extends Producto{

    tipo: string;
    fechaInicio: string;
    fechaFin: string;
    resumen: string;
    codigo: number;

    constructor(){
        super();
    }

}
