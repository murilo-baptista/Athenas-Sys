import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FuncionarioService } from '../../../core/services/funcionario.service';
import { CargoFuncionario, Funcionario } from '../../../core/models/funcionario.model';

interface FormularioFuncionario {
  nome: string;
  codigo: string;
  cargo: CargoFuncionario | null;
}

@Component({
  selector: 'app-config-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './config-funcionarios.html'
})
export class ConfigFuncionariosComponent implements OnInit {

  funcionarios: Funcionario[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';

  idEmEdicao: number | null = null;
  form: FormularioFuncionario = this.formVazio();

  cargos: CargoFuncionario[] = ['GERENTE', 'RECEPCAO', 'GARCOM', 'COZINHA'];

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit(): void {
    this.carregar();
  }

  private formVazio(): FormularioFuncionario {
    return { nome: '', codigo: '', cargo: null };
  }

  carregar(): void {
    this.carregando = true;
    this.funcionarioService.listarPorRestaurante().subscribe({
      next: (funcionarios) => {
        this.funcionarios = funcionarios;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar os funcionários.';
      }
    });
  }

  cargoRotulo(cargo: CargoFuncionario): string {
    switch (cargo) {
      case 'GERENTE': return 'Gerente';
      case 'RECEPCAO': return 'Recepção';
      case 'GARCOM': return 'Garçom';
      case 'COZINHA': return 'Cozinha';
    }
  }

  editar(funcionario: Funcionario): void {
    this.idEmEdicao = funcionario.id;
    // O código não é retornado pela API na listagem/edição — só existe no
    // momento do cadastro. Por isso o campo fica vazio aqui (não editável).
    this.form = { nome: funcionario.nome, codigo: '', cargo: funcionario.cargo };
  }

  cancelarEdicao(): void {
    this.idEmEdicao = null;
    this.form = this.formVazio();
  }

  salvar(): void {
    if (!this.form.nome.trim() || !this.form.cargo || (!this.idEmEdicao && !this.form.codigo.trim())) {
      this.mensagemErro = 'Preencha nome, cargo' + (this.idEmEdicao ? '.' : ' e código.');
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';

    const requisicao$ = this.idEmEdicao
      ? this.funcionarioService.atualizar(this.idEmEdicao, {
          nome: this.form.nome.trim(),
          cargo: this.form.cargo
        })
      : this.funcionarioService.criar({
          nome: this.form.nome.trim(),
          codigo: this.form.codigo.trim(),
          cargo: this.form.cargo
        });

    requisicao$.subscribe({
      next: () => {
        this.salvando = false;
        this.cancelarEdicao();
        this.carregar();
      },
      error: () => {
        this.salvando = false;
        this.mensagemErro = 'Não foi possível salvar o funcionário. Verifique se o código já não está em uso.';
      }
    });
  }

  remover(funcionario: Funcionario): void {
    if (!confirm(`Remover o funcionário "${funcionario.nome}"?`)) return;

    this.funcionarioService.remover(funcionario.id).subscribe({
      next: () => this.carregar(),
      error: () => (this.mensagemErro = `Não foi possível remover "${funcionario.nome}".`)
    });
  }
}