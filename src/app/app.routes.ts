import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login';
import { AdminComponent } from './features/dashboard/administrador/administrador';
import { ClienteComponent } from './features/dashboard/cliente/cliente';
import { ClienteGuard } from './core/guards/cliente.guard';
import { MeseroComponent } from './features/dashboard/mesero/mesero';
import { MeseroGuard } from './core/guards/mesero.guard';
import { VerifyCode } from './features/auth/pages/verify-code/verify-code/verify-code';
import { OAuthCallbackComponent } from './features/auth/pages/oauth-callback/oauth-callback';
import { adminGuard } from './core/guards/admin.guard';
import { GPersonasComponent } from './features/dashboard/administrador/g-personas/g-personas';
import { GCategoriasComponent } from './features/dashboard/administrador/g-categorias/g-categorias';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  { 
    path: 'oauth-callback', 
    component: OAuthCallbackComponent },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
    {
  path: 'verify-code',
  component: VerifyCode,
  },
{
  path: 'dashboard/administrador',
  component: AdminComponent,
  canActivate: [adminGuard],
  runGuardsAndResolvers: 'always',
  children: [
    {
      path: 'g-personas',
      loadComponent: () =>
        import('./features/dashboard/administrador/g-personas/g-personas')
          .then(m => m.GPersonasComponent)
    },
    {
      path: 'g-categorias',
      loadComponent: () =>
        import('./features/dashboard/administrador/g-categorias/g-categorias')
          .then(m => m.GCategoriasComponent)
    }
  ]
},
    {
  path: 'dashboard/cliente',
  component: ClienteComponent,
  canActivate: [ClienteGuard]
  },
    {
  path: 'dashboard/mesero',
  component: MeseroComponent,
  canActivate: [MeseroGuard]
  },
  
];