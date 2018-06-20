import { Producto } from "./producto";

export class Libro extends Producto{

    editorial: string;
    isbn: string;

    constructor(){
        super();
    }
}
