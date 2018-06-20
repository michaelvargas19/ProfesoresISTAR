export abstract class Producto {

    titulo: string;
    fechaPublicacion: string;
    palabrasClae: string[];
    temas: string[];
    coautores: string[];

    constructor(){
        this.palabrasClae = [];
        this.temas = [];
        this.coautores = [];
    }

    
}