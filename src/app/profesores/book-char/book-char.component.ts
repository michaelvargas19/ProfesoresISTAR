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
  selector: 'book-char',
  templateUrl: './book-char.component.html',
  styleUrls: ['./book-char.component.css']
})
export class BookCharComponent implements OnInit {

 
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

    this.getCapitulos();

  }




getCapitulos(){
  
  this.capitulos=[];

  for(var i=0; i< this.profesor.productos.length; i++){
    if (this.profesor.productos[i] instanceof Capitulo){
        this.capitulos.push(<Capitulo>this.profesor.productos[i]);
           
    }
  }
}



getTemas(p: Producto){
  var t="";
  for(var i=0; i< p.temas.length; i++){
    if(i> 0 && i < (p.temas.length) && t!= ""){
      t= t + ","; 
      
    }
      t = t + p.temas[i];
  }
  return t;
}


getAutores(p: Producto){
  var t="";
  for(var i=0; i< p.coautores.length; i++){
      t = t + p.coautores[i]+", ";
  }

  return t;
}

verFecha(n: number):string{
  var d = new Date(n);
      return d.toLocaleDateString();
  }

 //-------------------------------------------


}
