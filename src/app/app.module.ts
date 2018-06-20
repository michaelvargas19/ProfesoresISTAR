import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TabModule } from  './profesores/tab/tab.module'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

//import { FormsModule } from '@angular/forms';
//import {MatInputModule} from '@angular/material/input';
//import {MatTabsModule} from '@angular/material/tabs';


import { AppComponent } from './app.component';
import { HomeComponent } from './profesores/home/home.component';
import { ProfileComponent } from './profesores/profile/profile.component';
import { EducationComponent } from './profesores/education/education.component';
import { BiographyComponent } from './profesores/biography/biography.component';
import { ArticlesComponent } from './profesores/articles/articles.component';
import { BooksComponent } from './profesores/books/books.component';
import { BookCharComponent } from './profesores/book-char/book-char.component';
import { ConfePaperComponent } from './profesores/confe-paper/confe-paper.component';
import { ProjectsComponent } from './profesores/projects/projects.component';
import { ServicesComponent } from './profesores/services/services.component';
import { ServiceService } from './profesores/compartido/services/service.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    EducationComponent,
    BiographyComponent,
    ArticlesComponent,
    BooksComponent,
    BookCharComponent,
    ConfePaperComponent,
    ProjectsComponent,
    ServicesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    TabModule
  //  MatTabsModule,
    
  //  MatInputModule
  //  FormsModule
  
  ],
  providers: [ServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
  