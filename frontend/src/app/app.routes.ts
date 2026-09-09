import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { MenuComponent } from './features/menu/menu';
import { AutenticacaoComponent } from './features/autenticacao/autenticacao';
import { CadastroRestauranteComponent } from './features/cadastro-restaurante/cadastro-restaurante';
import { CadastroMesasComponent } from './features/cadastro-mesas/cadastro-mesas';
import { CadastroFuncionariosComponent } from './features/cadastro-funcionarios/cadastro-funcionarios';
import { MapaMesasComponent } from './features/recepcao/mapa-mesas/mapa-mesas';
import { LancamentoPedidosComponent } from './features/garcom/lancamento-pedidos/lancamento-pedidos';
import { PainelKdsComponent } from './features/cozinha/painel-kds/painel-kds';
import { DashboardComponent } from './features/gerente/dashboard/dashboard';
import { authGuard, funcionarioGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 1. Login do restaurante
  { path: 'login', component: LoginComponent },

  // 2. Cadastro (Wizard de Onboarding: Restaurante -> Mesas -> Funcionários)
  { path: 'cadastro-restaurante', component: CadastroRestauranteComponent },
  { path: 'cadastro-mesas', component: CadastroMesasComponent },
  { path: 'cadastro-funcionarios', component: CadastroFuncionariosComponent },

  // 3. Menu de seleção de área (exige restaurante logado)
  { path: 'menu', component: MenuComponent, canActivate: [authGuard] },

  // 4. Autenticação do funcionário para a área escolhida (exige restaurante logado)
  { path: 'autenticacao', component: AutenticacaoComponent, canActivate: [authGuard] },

  // 5. Telas operacionais (exigem funcionário autenticado com o cargo correto)
  { path: 'recepcao', component: MapaMesasComponent, canActivate: [funcionarioGuard], data: { cargo: 'RECEPCAO' } },
  { path: 'garcom', component: LancamentoPedidosComponent, canActivate: [funcionarioGuard], data: { cargo: 'GARCOM' } },
  { path: 'cozinha', component: PainelKdsComponent, canActivate: [funcionarioGuard], data: { cargo: 'COZINHA' } },
  { path: 'gerente', component: DashboardComponent, canActivate: [funcionarioGuard], data: { cargo: 'GERENTE' } },

  { path: '**', redirectTo: 'login' }
];