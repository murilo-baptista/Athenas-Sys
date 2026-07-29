import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface CargoOption {
  label: string;
  icone: string;
  badgeClass: string;
}

interface Funcionario {
  nome: string;
  cargo: string;
  badgeClass: string;
}

@Component({
  selector: 'app-cadastro-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-funcionarios.html',
  styleUrl: './cadastro-funcionarios.css'
})
export class CadastroFuncionariosComponent {

  nomeFuncionario = '';
  senhaFuncionario = '';
  cargoSelecionado = 'Gerente';

  cargos: CargoOption[] = [
    { label: 'Gerente', icone: 'icone-gerente.png', badgeClass: '' },
    { label: 'Garçom', icone: 'icone-garcom.png', badgeClass: 'badge-bordo' },
    { label: 'Recepção', icone: 'icone-recepcionista.png', badgeClass: '' },
    { label: 'Cozinha', icone: 'icone-cozinha.png', badgeClass: 'badge-bordo' }
  ];

  funcionarios: Funcionario[] = [
    { nome: 'Maria Souza', cargo: 'Gerente', badgeClass: '' },
    { nome: 'João Pereira', cargo: 'Garçom', badgeClass: 'badge-bordo' }
  ];

  constructor(private router: Router) {}

  selecionarCargo(cargo: string): void {
    this.cargoSelecionado = cargo;
  }

  adicionarFuncionario(): void {
    if (!this.nomeFuncionario || !this.cargoSelecionado) {
      return;
    }

    const cargoInfo = this.cargos.find(c => c.label === this.cargoSelecionado);

    this.funcionarios.push({
      nome: this.nomeFuncionario,
      cargo: this.cargoSelecionado,
      badgeClass: cargoInfo ? cargoInfo.badgeClass : ''
    });

    this.nomeFuncionario = '';
    this.senhaFuncionario = '';
  }

  voltar(): void {
    this.router.navigate(['/cadastro-mesas']);
  }

  finalizar(): void {
    if (this.funcionarios.length === 0) {
      return;
    }

    // TODO: persistir os funcionários cadastrados (service/API) e concluir o onboarding
    this.router.navigate(['/login']);
  }
}