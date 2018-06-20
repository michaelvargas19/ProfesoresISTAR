import { Component, OnInit, Input } from '@angular/core';
import { Profesor } from '../compartido/clases/profesor';
import { Puesto } from '../compartido/clases/puesto';
import { Educacion } from '../compartido/clases/educacion';
import { Articulo } from '../compartido/clases/articulo';
import { Capitulo } from '../compartido/clases/capitulo';
import { Evento } from '../compartido/clases/evento';
import { Libro } from '../compartido/clases/libro';
import { Proyecto } from '../compartido/clases/proyecto';
import { Producto } from '../compartido/clases/producto';

@Component({
  selector: 'books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  
  @Input() profesor: Profesor;
  
  puesto: Puesto;
  educacion: Educacion;
  articulo: Articulo;
  capitulo: Capitulo;
  evento: Evento;
  libro: Libro;
  proyecto: Proyecto;
  articulos: Articulo[];
  capitulos: Capitulo[];
  libros: Libro[];
  eventos: Evento[];
  proyectos: Proyecto[];
  

  constructor() { }

  ngOnInit() {

    this.getLibros();

  }


getLibros(){
  
  this.libros=[];

  for(var i=0; i< this.profesor.productos.length; i++){
    if (this.profesor.productos[i] instanceof Libro){
        this.libros.push(<Libro>this.profesor.productos[i]);
           
    }
  }
}


verFecha(n: number):string{
  var d = new Date(n);
      return d.toLocaleDateString();
  }

 //-------------------------------------------


}
