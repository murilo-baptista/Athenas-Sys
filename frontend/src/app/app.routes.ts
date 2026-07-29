import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { MenuComponent } from './features/menu/menu';
import { AutenticacaoComponent } from './features/autenticacao/autenticacao';
/* import { CadastroRestauranteComponent } from './features/cadastro-restaurante/cadastro-restaurante';
import { CadastroMesasComponent } from './features/cadastro-mesas/cadastro-mesas'; */
import { CadastroFuncionariosComponent } from './features/cadastro-funcionarios/cadastro-funcionarios';
import { MapaMesasComponent } from './features/recepcao/mapa-mesas/mapa-mesas';
import { LancamentoPedidosComponent } from './features/garcom/lancamento-pedidos/lancamento-pedidos';
import { PainelKdsComponent } from './features/cozinha/painel-kds/painel-kds';
import { DashboardComponent } from './features/gerente/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // 3. Rota do Menu de Seleção de Áreas do Restaurante
  { path: 'menu', component: MenuComponent },

  // 4. Rota de Autenticação do Funcionário
  { path: 'autenticacao', component: AutenticacaoComponent },

  // 5. Rotas do Cadastro (Wizard de Onboarding: Restaurante -> Mesas -> Funcionários)
  /* { path: 'cadastro-restaurante', component: CadastroRestauranteComponent },
  { path: 'cadastro-mesas', component: CadastroMesasComponent }, */
  { path: 'cadastro-funcionarios', component: CadastroFuncionariosComponent },

  { path: 'recepcao', component: MapaMesasComponent },
  { path: 'garcom', component: LancamentoPedidosComponent },
  { path: 'cozinha', component: PainelKdsComponent },
  { path: 'gerente', component: DashboardComponent },

  { path: '**', redirectTo: 'login' }
];