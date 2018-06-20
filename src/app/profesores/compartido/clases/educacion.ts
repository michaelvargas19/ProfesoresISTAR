import { Producto } from "./producto";

export class Educacion{
  
    institucion: string;
    titulacion: string;
    disciplia: string;
    nota: string;
    anoInicio: number;
    anoFin: number;
    anexos:Producto [];    

    contructor(){

        this.anexos=[];
    }
 
}