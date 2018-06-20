import { Producto } from "./producto";

export class Articulo extends Producto{

    revista: string;
    volumen: number;
    idioma: string;
    url: string;
    doi: string;
    abstract: string;

    constructor(){
        super();
    }

}
