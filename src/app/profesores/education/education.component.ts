import { Component, OnInit, Input } from '@angular/core';
import { Articulo } from '../compartido/clases/articulo';
import { Capitulo } from '../compartido/clases/capitulo';
import { Libro } from '../compartido/clases/libro';
import { Evento } from '../compartido/clases/evento';
import { Proyecto } from '../compartido/clases/proyecto';
import { Profesor } from '../compartido/clases/profesor';

@Component({
  selector: 'education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {

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
