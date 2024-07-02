import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './cors/guards/auth.guard';
import { LoginGuard } from './cors/guards/login.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./authentication/authentication.module').then((m) => m.AuthenticationModule), canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
