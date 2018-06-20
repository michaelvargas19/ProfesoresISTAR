import { Puesto } from "./puesto";
import { Educacion } from "./educacion";
import { Producto } from "./producto";
import { InfoContact } from "./info-contact";
import { New } from "./new";
import { Award } from "./award";
import { Interest } from "./interest";
import { ScientificService } from "./scientific-service";
import { Student } from "./student";
import { Teaching } from "./teaching";

export class Profesor {
    
    nombre: string;
    apellidos: string;
    titular: string;
    puesto: Puesto;
    educacion: Educacion [];
    productos: Producto[];
    news: New [];
    awards: Award[];
    
    interests: Interest[];
    scientifics: ScientificService[];
    students: Student[];
    teachings: Teaching[];

    pais: string;
    codigoPostal: string;
    extracto: string;
    urlFoto: string;
    email: string;
    infoContact: InfoContact;
    primaryArea: string;



    contructor(){

        this.educacion=[];
        this.news=[];
        this.awards=[];
        this.interests=[];
        this.scientifics=[];
        this.students=[];
        this.teachings=[];

        this.puesto= new Puesto ();
        this.infoContact= new InfoContact();

    }

    
}
