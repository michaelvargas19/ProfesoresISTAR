import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profesores/profile/profile.component';

/**agregar las rutas */
const routes: Routes = [
 {path: 'profile', component: ProfileComponent},

// {path: 'evento/vistaevento/:id', component: VistaEventoComponent},
 
  {path: '', pathMatch: 'full', redirectTo: 'profile'},//por defecto
];    

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
