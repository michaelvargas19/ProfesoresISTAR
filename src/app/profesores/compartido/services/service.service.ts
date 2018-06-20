import { Injectable } from '@angular/core';
import { Profesor } from '../clases/profesor';
import { Puesto } from '../clases/puesto';
import { Educacion } from '../clases/educacion';
import { Articulo } from '../clases/articulo';
import { Libro } from '../clases/libro';
import { Evento } from '../clases/evento';
import { Capitulo } from '../clases/capitulo';
import { Proyecto } from '../clases/proyecto';
import { InfoContact } from '../clases/info-contact';
import { New } from '../clases/new';
import { Award } from '../clases/award';
import { Interest } from '../clases/interest';
import { ScientificService } from '../clases/scientific-service';
import { Student } from '../clases/student';
import { Teaching } from '../clases/teaching';

@Injectable()
export class ServiceService {

  profesor: Profesor;
  infoContact: InfoContact;
  puesto: Puesto;
  educacion: Educacion;
  articulo: Articulo;
  capitulo: Capitulo;
  evento: Evento;
  libro: Libro;
  proyecto: Proyecto;
  new: New;
  award: Award;
  interest: Interest;
  scientific: ScientificService;
  student: Student;
  teaching: Teaching;
  articulos: Articulo[];
  capitulos: Capitulo[];
  libros: Libro[];
  eventos: Evento[];
  proyectos: Proyecto[];
  


  constructor() {

    this.iniciar();

   }

   iniciar(){
  
    this.profesor = new Profesor();
    this.infoContact = new InfoContact();
    this.profesor.educacion=[];
    this.profesor.productos=[];
    this.profesor.nombre="Alexandra Pomares Quimbaya";
    //this.profesor.apellidos="Pomares";
    this.profesor.titular="Associate Professor at Pontificia Universidad Javeriana";
    this.profesor.primaryArea="Data Analysis";

    this.infoContact.email = "pomares@javeriana.edu.co";
    this.infoContact.address = "Bogotá, Colombia, Avenue 7 No. 40 - 62";
    this.infoContact.office = "Building José Gabriel Maldonado, S.J., Floor 2";
    this.infoContact.officePhone = 3208320;
    this.infoContact.extension = 5338;
    this.profesor.infoContact= this.infoContact;
    
    
    this.profesor.puesto=new Puesto();
    this.profesor.puesto.cargo="Director Of The Research Group";
    
  
    this.educacion= new Educacion();
    this.educacion.institucion="Institut national polytechnique de Grenoble";
    this.educacion.titulacion="Doctor (PhD)";
    this.educacion.disciplia="Informatique";
    this.educacion.anoInicio=2007;
    this.educacion.anoFin=2010;
    this.profesor.educacion.push(this.educacion);
    
    this.educacion= new Educacion();
    this.educacion.institucion="Universidad de los Andes";
    this.educacion.titulacion="Docteur (PhD)";
    this.educacion.disciplia="Systems Engineering";
    this.educacion.anoInicio=2007;
    this.educacion.anoFin=2010;
    this.profesor.educacion.push(this.educacion);
  
    this.educacion= new Educacion();
    this.educacion.institucion="Universidad de los Andes";
    this.educacion.titulacion="Maestría (MsC)";
    this.educacion.disciplia="Ingeniería de Sistemas y Computación";
    this.educacion.anoInicio=2003;
    this.educacion.anoFin=2016;
    this.profesor.educacion.push(this.educacion);
  
    this.profesor.pais="Colombia";
    this.profesor.codigoPostal="110231";
  
    this.profesor.extracto = "Alexandra Pomares is Associate Professor at Pontificia Universidad Javeriana. She received her Ph.D. in Engineering from Universidad de los Andes, Bogotá, Colombia and her Ph.D in Informatics from Université de Grenoble, France.     Alexandra has an extensive experience on data integration and data analysis. She is currently working on the design and development of solutions for information analysis in sectors with high volumen of narrative texts.";
    this.profesor.urlFoto = "http://ingenieria.javeriana.edu.co/image/journal/article?img_id=9513898&t=1523890018754";
  
  
    this.addArticulos();
    this.addCapitulos();
    this.addEventos();
    this.addLibros();
    this.addProyectos();
    this.addNews();

    this.addAwards();  
    this.addInterests();
    this.addScientifics();
    this.addStudents();
    this.addTeaching();
    
    }


  addArticulos(){

    this.articulo=new Articulo();

    this.articulo.titulo="A systematic review of serious games in medical education: quality of evidence and pedagogical strategy";
    this.articulo.fechaPublicacion= "2018,2,13";
    
    this.articulo.palabrasClae.push("Video games");
    this.articulo.palabrasClae.push("medical education");
    this.articulo.palabrasClae.push("evidence-based practice");
    this.articulo.palabrasClae.push("comparative effectiveness research");
    this.articulo.palabrasClae.push("review");

    this.articulo.temas.push("Ingeniería de Sistemas y Comunicaciones");
    
    this.articulo.coautores.push(this.profesor.nombre);
    this.articulo.coautores.push("Iouri Gorbanev Fedorenchik");
    this.articulo.coautores.push("Sandra Milena Agudelo Londoño");
    this.articulo.coautores.push("Rafael A. Gonzalez");
    this.articulo.coautores.push("Iris Viviana Delgadillo Esguerra");
    this.articulo.coautores.push("Oscar Mauricio Muñoz Velandia");
    this.articulo.coautores.push("Francisco José Yepes Luján");

    this.articulo.revista="Medical Education Online";
    this.articulo.volumen=23;
    this.articulo.idioma="Inglés";
    this.articulo.url="https://www.tandfonline.com/doi/abs/10.1080/10872981.2018.1438718";
    this.articulo.doi="10.1080/10872981.2018.1438718";

    this.profesor.productos.push(this.articulo);


    this.articulo=new Articulo();

    this.articulo.titulo="Concept Attribute Labeling and Context-Aware Named Entity Recognition in Electronic Health Records";
    this.articulo.fechaPublicacion= "2018,1,13";
    
    this.articulo.palabrasClae.push("Concept Attribute Labeling");
    this.articulo.palabrasClae.push("Electronic Health Records");
    this.articulo.palabrasClae.push("Named Entity Recognition");
    this.articulo.palabrasClae.push("Text Mining");

    this.articulo.temas.push("Ingeniería de Sistemas y Comunicaciones");


    this.articulo.coautores.push(this.profesor.nombre);
    this.articulo.coautores.push("Rafael Andrés González Rivera");
    this.articulo.coautores.push("Oscar Mauricio Muñoz Velandia");
    this.articulo.coautores.push("Angel Alberto Garcia Peña");
    this.articulo.coautores.push("Julian Camilo Daza Rodriguez");
    this.articulo.coautores.push("Alejandro Sierra Múnera");
    this.articulo.coautores.push("Cyril Labbé");

    this.articulo.revista="International Journal of Reliable and Quality E-Healthcare (IJRQEH)";
    this.articulo.volumen=7;
    this.articulo.idioma="Inglés";
    this.articulo.url="https://www.igi-global.com/article/concept-attribute-labeling-and-context-aware-named-entity-recognition-in-electronic-health-records/190642";
    this.articulo.doi="10.4018/IJRQEH.2018010101";

    this.profesor.productos.push(this.articulo);


    this.articulo=new Articulo();

    this.articulo.titulo="A Strategy for Prioritizing Electronic Medical Records Using Structured Analysis and Natural Language Processing";
    this.articulo.fechaPublicacion= "22/01/2018";
    
    this.articulo.palabrasClae.push("electronic medical records");
    this.articulo.palabrasClae.push("natural language processing");
    this.articulo.palabrasClae.push("narrative text");

    this.articulo.coautores.push(this.profesor.nombre);
    this.articulo.coautores.push("Rafael A. Gonzalez");
    this.articulo.coautores.push("Oscar Mauricio Muñoz Velandia");
    this.articulo.coautores.push("Ricardo Bohorquez Rodriguez");
    this.articulo.coautores.push("Olga Milena Garcia Morales");
    
    this.articulo.temas.push("Ingeniería de Sistemas y Comunicaciones");


    this.articulo.revista="Ingenieria Y Universidad";
    this.articulo.volumen=22;
    this.articulo.idioma="Inglés";
    this.articulo.url="http://revistas.javeriana.edu.co/index.php/iyu/article/view/17809";
    this.articulo.doi="dx.doi.org/10.11144/Javeriana.iyu22-1.spem";

    this.profesor.productos.push(this.articulo);

  }


  addCapitulos(){

    this.capitulo=new Capitulo();

    this.capitulo.titulo="ICT for Enabling the Quality Evaluation of Health Care Services: A Case Study in a General Hospital";
    this.capitulo.fechaPublicacion= "19/10/2016";
    
    this.capitulo.palabrasClae.push("");
    this.capitulo.palabrasClae.push("");
    this.capitulo.palabrasClae.push("");

    this.capitulo.temas.push("Ingeniería de Sistemas y Comunicaciones");

    this.capitulo.coautores.push(this.profesor.nombre);
    this.capitulo.coautores.push("Rafael A. Gonzalez");
    this.capitulo.coautores.push("Alejandro Sierra Múnera");
    this.capitulo.coautores.push("Oscar Mauricio MUÑOZ VELANDIA");
    this.capitulo.coautores.push("Angel Alberto Garcia Peña");
    this.capitulo.coautores.push("olga milena garcia morales");
    this.capitulo.coautores.push("Ricardo BOHORQUEZ RODRIGUEZ");

    

    this.capitulo.libro="Design, Development, and Integration of Reliable Electronic Healthcare Platforms";
    this.capitulo.lugar="IGI Global";

    this.profesor.productos.push(this.capitulo);


    this.capitulo=new Capitulo();

    this.capitulo.titulo="A Review of Existing Applications and Techniques for Narrative Text Analysis in Electronic Medical Records";
    this.capitulo.fechaPublicacion= "19/10/2016";
    
    this.capitulo.temas.push("Ingeniería de Sistemas y Comunicaciones");

    this.capitulo.coautores.push(this.profesor.nombre);
    this.capitulo.coautores.push("Rafael A. Gonzalez");
    this.capitulo.coautores.push("Oscar Mauricio MUÑOZ VELANDIA");
    this.capitulo.coautores.push("Ricardo BOHORQUEZ RODRIGUEZ");
    this.capitulo.coautores.push("olga milena garcia morales");
    this.capitulo.coautores.push("Darío Londoño Trujillo");

    this.capitulo.libro="Encyclopedia of E-Health and Telemedicine";
    this.capitulo.lugar="IGI Global";

    this.profesor.productos.push(this.capitulo);
  }

  addEventos(){


    this.evento=new Evento();

    this.evento.nombre="20th International Conference on Enterprise Information SystemsAt: Funchal";
    this.evento.tipoEvento="Congreso";
    this.evento.ambito="Internacional",
    this.evento.ciudad="Portugal";
    this.evento.fechaInicio= new Date("2018-03-21");
    this.evento.fechaFin= new Date("2018-03-24");
    this.evento.resumen="";
    //this.evento.productos=
    this.evento.url=" http://www.iceis.org/";

    this.profesor.productos.push(this.evento);



    this.evento=new Evento();

    this.evento.nombre="9th International Conference on Knowledge Management and Information Sharing";
    this.evento.tipoEvento="Congreso";
    this.evento.ambito="Internacional",
    this.evento.ciudad="Funchal";
    this.evento.fechaInicio= new Date("2017-11-01");
    this.evento.fechaFin= new Date("2017,11,3");
    this.evento.resumen="";
    //this.evento.productos=
    this.evento.url="http://www.kmis.ic3k.org/";

    this.profesor.productos.push(this.evento);
  }

  addLibros(){

    this.libro = new Libro();

    this.libro.titulo="ASHYI Plataforma basada en agentes para la planificación dinámica, inteligente y adaptativa de actividades aplicada a la educación personalizada";
    this.libro.fechaPublicacion= "12/6/2015";
    
    //this.libro.palabrasClae.push("");
 

    this.libro.temas.push("");
    this.libro.temas.push("");

    this.libro.coautores.push(this.profesor.nombre);
    this.libro.coautores.push("Angela Carrillo Ramos");
    this.libro.coautores.push("Mery Yolima Uribe Rios");
    this.libro.coautores.push("LUISA FERNANDA BARRERA LEÓN");
    this.libro.coautores.push("Jaime Andrés Pavlich Mariscal");
    this.libro.coautores.push("Julio Ernesto CARREÑO VARGAS");
    this.libro.coautores.push("Monica Ilanda Brijaldo Rodríguez");
    this.libro.coautores.push("Martha Leonor Sabogal Modera");

    this.libro.editorial="Editorial Pontificia Universidad Javeriana";
    this.libro.isbn="978-958-716-827-3";


    this.profesor.productos.push(this.libro);
  }

  addProyectos(){

    this.proyecto=new Proyecto();

    this.proyecto.titulo="System of analysis of indicators of adherence to clinical practice guidelines";
    this.proyecto.fechaPublicacion= "May 2014";
    
    //this.proyecto.temas.push("");
    //this.proyecto.temas.push("");

    this.proyecto.coautores.push(this.profesor.nombre);
    

    this.proyecto.tipo="Computational";
    this.proyecto.fechaInicio= "May 2014";
    this.proyecto.fechaFin= null;
    this.proyecto.resumen="Las  Guías de Práctica Clínica (GPC) han ganado gran aceptación dado que permiten sintetizar grandes volúmenes de información en un formato conveniente para ser usado por quienes participan en la toma de decisiones en salud.";
    this.proyecto.codigo=   6152;

    this.profesor.productos.push(this.proyecto);
  }


  addNews(){
    this.profesor.news=[];
    
    this.new = new New();
    this.new.tittle = "Closing Diploma Business Intelligence 2018 -1";
    this.new.description = "Closing Diploma Business Intelligence 2018 -1. (06/06/2018)";
    this.new.url = "http://news.mit.edu/2017/computer-system-predicts-products-chemical-reactions-0627";
    this.new.date = new Date();

    this.profesor.news.push(this.new);


    this.new = new New();
    this.new.tittle = "Citizen Data Course";
    this.new.description = "Citizen Data Course April 2018";
    this.new.url = "http://news.mit.edu/2017/computer-system-predicts-products-chemical-reactions-0627";
    this.new.date = new Date();

    this.profesor.news.push(this.new);


  }

  addAwards(){
    this.profesor.awards=[];
    
    this.award= new Award();
    this.award.description="Nomination Prize Merit Order Vicente Pizano Restrepo";
    this.award.year=2017;

    this.profesor.awards.push(this.award);


  }

  addInterests(){
    this.profesor.interests=[];

    this.interest= new Interest();
    this.interest.area="Data Mining";
    this.interest.topics=[];
    this.interest.topics.push("Data Anonymization");
    

    this.profesor.interests.push(this.interest);

    this.interest= new Interest();
    this.interest.area="Data Analysis";
    this.interest.topics=[];
    this.interest.topics.push("Electronic Health Records Analysis");
    this.interest.topics.push("Social Network Analysis");

    this.profesor.interests.push(this.interest);

  }

  addScientifics(){
    this.profesor.scientifics=[];


    this.scientific= new ScientificService();
    this.scientific.tittle="Project Evaluator, Centaries Data";
    this.scientific.type="Conference";
    this.scientific.country="Colombia";
    this.scientific.ambit="International";
    this.scientific.year=2017;
    this.scientific.entity="Colciencias";

    this.profesor.scientifics.push(this.scientific);



    this.scientific= new ScientificService();
    this.scientific.tittle="Project Evaluator, Journal Computer Technology Management";
    this.scientific.type="Conference";
    this.scientific.country="Colombia";
    this.scientific.ambit="International";
    this.scientific.year=2014;
    this.scientific.entity="Colciencias";

    this.profesor.scientifics.push(this.scientific);

    this.scientific= new ScientificService();
    this.scientific.tittle="Project Evaluator, International Journal of Information Technologies and Systems Approach (IJITSA)";
    this.scientific.type="Project";
    this.scientific.country="Colombia";
    this.scientific.ambit="International";
    this.scientific.year=2014;
    this.scientific.entity="Colciencias";

    this.profesor.scientifics.push(this.scientific);


    this.scientific= new ScientificService();
    this.scientific.tittle="Project Evaluator, Journal Engineering and Competitiveness";
    this.scientific.type="Project";
    this.scientific.country="Colombia";
    this.scientific.ambit="National";
    this.scientific.year=2013;
    this.scientific.entity="Colciencias";

    this.profesor.scientifics.push(this.scientific);

    this.scientific= new ScientificService();
    this.scientific.tittle="Project Evaluator, Conference SIB";
    this.scientific.type="Conference";
    this.scientific.country="Colombia";
    this.scientific.ambit="International";
    this.scientific.year=2012;
    this.scientific.entity="Colciencias";

    this.profesor.scientifics.push(this.scientific);

    this.scientific= new ScientificService();
    this.scientific.tittle="Project Evaluator, International Journal of Technology and Human Interaction (IJTHI)";
    this.scientific.type="Project";
    this.scientific.country="Colombia";
    this.scientific.ambit="International";
    this.scientific.year=2011;
    this.scientific.entity="Colciencias";

    this.profesor.scientifics.push(this.scientific);


    this.scientific= new ScientificService();
    this.scientific.tittle="Project Evaluator";
    this.scientific.type="Project";
    this.scientific.country="Colombia";
    this.scientific.ambit="National";
    this.scientific.year=2011;
    this.scientific.entity="Colciencias";

    this.profesor.scientifics.push(this.scientific);

    this.scientific= new ScientificService();
    this.scientific.tittle="Project Evaluator";
    this.scientific.type="Project";
    this.scientific.country="Colombia";
    this.scientific.ambit="National";
    this.scientific.year=2010;
    this.scientific.entity="Colciencias";

    this.profesor.scientifics.push(this.scientific);

    

    this.scientific= new ScientificService();
    this.scientific.tittle="Project Evaluator";
    this.scientific.type="Project";
    this.scientific.country="Colombia";
    this.scientific.ambit="National";
    this.scientific.year=2009;
    this.scientific.entity="Colciencias";

    this.profesor.scientifics.push(this.scientific);


    this.scientific= new ScientificService();
    this.scientific.tittle="Project Evaluator";
    this.scientific.type="Project";
    this.scientific.country="Colombia";
    this.scientific.ambit="National";
    this.scientific.year=2008;
    this.scientific.entity="Colciencias";

    this.profesor.scientifics.push(this.scientific);

  }

  addStudents(){
    this.profesor.students=[];

    
    this.student= new Student ();
    this.student.name="William Enrique Parra Alba";
    this.student.dateStart="Janury 2016";
    this.student.dateEnd="December 2016";
    this.student.state="expected";
    this.student.topic="MODELO Y SISTEMA DE ANÁLISIS, GENERACIÓN Y ENTREGA DE INFORMACIÓN, PARA APOYAR LA TOMA DE DECISIONES A PARTIR DE DATOS OBTENIDOS DE PACIENTES REMOTOS DE LA TERCERA EDAD CON NEUMONÍA ADQUIRIDA EN LA COMUNIDAD (NAC)";
    
    this.profesor.students.push(this.student);


    this.student= new Student ();
    this.student.name="Daniel Alejandro Calambás, Jaime Andrés Mendoza";
    this.student.dateStart="January 2016";
    this.student.dateEnd="December 2016";
    this.student.state="expected";
    this.student.topic="Real Time Social Data Mining Framework para la Extracción de Información de Publicaciones de Facebook";
    
    this.profesor.students.push(this.student);

    this.student= new Student ();
    this.student.name="Wilson Alzate Calderón";
    this.student.dateStart="Janury 2014";
    this.student.dateEnd="Janury 2015";
    this.student.state="expected";
    this.student.topic="FRAMEWORK DE PRE-PROCESAMIENTO DE DATOS EN MINERIA DE TEXTO BASADO EN TECNOLOGIAS DE BIG DATA";
    
    this.profesor.students.push(this.student);

  }

  addTeaching(){
    this.profesor.teachings=[];

    this.teaching= new Teaching();
    this.teaching.name ="Data Management";
    this.teaching.description="Data management is the practice of organizing and maintaining data processes to meet the needs of the continuous life cycle of information. The emphasis on data management began with the electronic age of data processing, but data management methods have roots in accounting, statistics, logistics planning and other disciplines that predate the emergence of corporate computing in the mid-20th century.";
    this.teaching.yearStart=2017;
    this.teaching.yearEnd=2018;

    this.profesor.teachings.push(this.teaching);

    this.teaching= new Teaching();
    this.teaching.name ="Analytical Methods and Applications";
    this.teaching.description="Data analysis is a process of inspecting, cleansing, transforming, and modeling data with the goal of discovering useful information, informing conclusions, and supporting decision-making. Data analysis has multiple facets and approaches, encompassing diverse techniques under a variety of names, while being used in different business, science, and social science domains.";
    this.teaching.yearStart=2011;
    this.teaching.yearEnd=2018;

    this.profesor.teachings.push(this.teaching);


    this.teaching= new Teaching();
    this.teaching.name ="Data Mining";
    this.teaching.description="It is the process of extracting significant information from large databases, information that reveals business intelligence, through hidden factors, trends and correlations to allow the user to make predictions that solve business problems by providing a competitive advantage.";
    this.teaching.yearStart=2011;
    this.teaching.yearEnd=2018;

    this.profesor.teachings.push(this.teaching);

    this.teaching= new Teaching();
    this.teaching.name ="Information Systems";
    this.teaching.description="Information system, an integrated set of components for collecting, storing, and processing data and for providing information, knowledge, and digital products. Business firms and other organizations rely on information systems to carry out and manage their operations, interact with their customers and suppliers, and compete in the marketplace.";
    this.teaching.yearStart=2011;
    this.teaching.yearEnd=2018;

    this.profesor.teachings.push(this.teaching);
  }

  //---------------------------------------------

  




}
