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
import { GProductosComponent } from './features/dashboard/administrador/g-productos/g-productos';
import { GMesasComponent } from './features/dashboard/administrador/g-mesas/g-mesas';
import { PedidoComponent } from './features/dashboard/mesero/pedido/pedido';
import { RegisterComponent } from './features/auth/pages/registro/registro';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password';
import { ResetPasswordComponent } from './features/auth/pages/reset-password/reset-password';
import { PoliticaComponent } from './features/auth/pages/politica/politica';
import { MenuComponent } from './features/dashboard/cliente/menu/menu';
import { CarritoComponent } from './features/dashboard/cliente/carrito/carrito';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
    {
    path: 'registro',
    component: RegisterComponent
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
  { path: 'recuperar-password', 
    component: ForgotPasswordComponent 
  },
  { path: 'reset-password',
    component: ResetPasswordComponent 
  },
  {
  path: 'politica',
    component: PoliticaComponent 

},
{
  path: 'dashboard/administrador',
  component: AdminComponent,
  canActivate: [adminGuard],
  runGuardsAndResolvers: 'always',
  children: [

    {
      path: '',
      redirectTo: 'g-personas',
      pathMatch: 'full'
    },

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
    },
    {
      path: 'g-productos',
      loadComponent: () =>
        import('./features/dashboard/administrador/g-productos/g-productos')
          .then(m => m.GProductosComponent)
    },
    {
      path: 'g-inventario',
      loadComponent: () =>
        import('./features/dashboard/administrador/g-inventario/g-inventario')
          .then(m => m.GInventarioComponent)
    },
    {
      path: 'g-mesas',
      loadComponent: () =>
        import('./features/dashboard/administrador/g-mesas/g-mesas')
          .then(m => m.GMesasComponent)
    }
  ]
},
{
  path: 'dashboard/cliente',
  component: ClienteComponent,
  canActivate:[ClienteGuard],
  children:[
    {
      path:'',
      loadComponent:() =>
        import('./features/dashboard/cliente/inicio/inicio')
        .then(m => m.InicioComponent)
    },
    {
      path:'menu',
      component:MenuComponent
    },
    {
      path:'carrito',
      loadComponent:() =>
        import('./features/dashboard/cliente/carrito/carrito')
        .then(m => m.CarritoComponent)
    }
  ]
},
{
  path: 'dashboard/mesero',
  component: MeseroComponent,
  canActivate: [MeseroGuard],
  children: [

    {
      path: '',
      loadComponent: () =>
        import('./features/dashboard/mesero/mesas/mesas')
          .then(m => m.MesasComponent)
    },

    {
      path: 'perfil',
      loadComponent: () =>
        import('./features/dashboard/mesero/perfilMesero/perfilMesero')
          .then(m => m.PerfilMeseroComponent)
    },
  ]
},
{
  path: 'dashboard/mesero/pedido/:mesaId',
  loadComponent: () =>
    import('./features/dashboard/mesero/pedido/pedido')
      .then(m => m.PedidoComponent),
  canActivate: [MeseroGuard]
}
];