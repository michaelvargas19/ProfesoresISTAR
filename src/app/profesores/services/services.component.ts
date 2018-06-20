import { Component, OnInit, Input } from '@angular/core';
import { Profesor } from '../compartido/clases/profesor';
import { Articulo } from '../compartido/clases/articulo';
import { Capitulo } from '../compartido/clases/capitulo';
import { Libro } from '../compartido/clases/libro';
import { Evento } from '../compartido/clases/evento';
import { Proyecto } from '../compartido/clases/proyecto';

@Component({
  selector: 'services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

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
