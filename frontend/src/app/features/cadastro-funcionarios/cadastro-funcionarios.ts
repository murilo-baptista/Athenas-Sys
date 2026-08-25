import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionarioService } from '../../core/services/funcionario.service';
import { AuthService } from '../../core/services/auth.service';
import { CargoFuncionario, Funcionario } from '../../core/models/funcionario.model';

interface CargoOption {
  label: CargoFuncionario;
  icone: string;
  badgeClass: string;
}

@Component({
  selector: 'app-cadastro-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-funcionarios.html',
  styleUrl: './cadastro-funcionarios.css'
})
export class CadastroFuncionariosComponent implements OnInit {

  nomeFuncionario = '';
  senhaFuncionario = '';
  cargoSelecionado: CargoFuncionario = 'Gerente';

  cargos: CargoOption[] = [
    { label: 'Gerente', icone: 'icone-gerente.png', badgeClass: '' },
    { label: 'Garçom', icone: 'icone-garcom.png', badgeClass: 'badge-bordo' },
    { label: 'Recepção', icone: 'icone-recepcionista.png', badgeClass: '' },
    { label: 'Cozinha', icone: 'icone-cozinha.png', badgeClass: 'badge-bordo' }
  ];

  funcionarios: Funcionario[] = [];

  carregando = false;
  salvando = false;
  mensagemErro = '';

  private restauranteId!: number;

  constructor(
    private router: Router,
    private funcionarioService: FuncionarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.authService.getRestauranteId();
    if (!id) {
      this.router.navigate(['/cadastro-restaurante']);
      return;
    }
    this.restauranteId = id;
    this.carregarFuncionarios();
  }

  private carregarFuncionarios(): void {
    this.carregando = true;
    this.funcionarioService.listarPorRestaurante(this.restauranteId).subscribe({
      next: (funcionarios) => {
        this.funcionarios = funcionarios;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar os funcionários já cadastrados.';
      }
    });
  }

  selecionarCargo(cargo: CargoFuncionario): void {
    this.cargoSelecionado = cargo;
  }

  badgeClassDoCargo(cargo: CargoFuncionario): string {
    return this.cargos.find(c => c.label === cargo)?.badgeClass ?? '';
  }

  adicionarFuncionario(): void {
    this.mensagemErro = '';

    if (!this.nomeFuncionario || !this.senhaFuncionario || !this.cargoSelecionado) {
      this.mensagemErro = 'Preencha nome, código e cargo do funcionário.';
      return;
    }

    this.salvando = true;

    this.funcionarioService.criar({
      nome: this.nomeFuncionario,
      codigo: this.senhaFuncionario,
      cargo: this.cargoSelecionado,
      restauranteId: this.restauranteId
    }).subscribe({
      next: (funcionarioCriado) => {
        this.funcionarios.push(funcionarioCriado);
        this.nomeFuncionario = '';
        this.senhaFuncionario = '';
        this.salvando = false;
      },
      error: () => {
        this.salvando = false;
        this.mensagemErro = 'Não foi possível adicionar esse funcionário. Tente novamente.';
      }
    });
  }

  removerFuncionario(index: number): void {
    const funcionario = this.funcionarios[index];
    if (!funcionario.id) {
      this.funcionarios.splice(index, 1);
      return;
    }

    this.funcionarioService.remover(funcionario.id).subscribe({
      next: () => this.funcionarios.splice(index, 1),
      error: () => this.mensagemErro = 'Não foi possível remover esse funcionário.'
    });
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.visibility = 'hidden';
  }

  voltar(): void {
    this.router.navigate(['/cadastro-mesas']);
  }

  finalizar(): void {
    if (this.funcionarios.length === 0) {
      this.mensagemErro = 'Cadastre pelo menos 1 funcionário para concluir.';
      return;
    }

    // Onboarding concluído: encerra a sessão temporária e leva ao login definitivo.
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}