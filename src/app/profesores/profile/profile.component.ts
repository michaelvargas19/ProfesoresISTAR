import { Component, OnInit, Input } from '@angular/core';
import { Profesor } from '../compartido/clases/profesor';
import { Puesto } from '../compartido/clases/puesto';
import { Capitulo } from '../compartido/clases/capitulo';
import { Educacion } from '../compartido/clases/educacion';
import { Evento } from '../compartido/clases/evento';
import { Articulo } from '../compartido/clases/articulo';
import { Libro } from '../compartido/clases/libro';
import { Proyecto } from '../compartido/clases/proyecto';
import { Producto } from '../compartido/clases/producto';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input() profesor: Profesor;

  articulos: Articulo[];
  capitulos: Capitulo[];
  libros: Libro[];
  eventos: Evento[];
  proyectos: Proyecto[];

  constructor() {  }

  ngOnInit() {
  //  this.iniciar();
    
  }


  verFecha(n: number):string{
    var d = new Date(n);
        return d.toLocaleDateString();
    }





}
