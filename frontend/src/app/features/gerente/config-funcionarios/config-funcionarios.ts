import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { FuncionarioService } from '../../../core/services/funcionario.service';
import { CargoFuncionario, Funcionario, FuncionarioDetalhamento } from '../../../core/models/funcionario.model';
import { EntidadeDesativada, ehEntidadeDesativada } from '../../../core/models/entidade-desativada.model';
import { mensagemDeErro } from '../../../core/utils/mensagem-erro';
import { ModalReativacaoComponent } from '../../../shared/components/modal-reativacao/modal-reativacao';

interface FormularioFuncionario {
  nome: string;
  codigo: string;
  cargo: CargoFuncionario | null;
}

interface FormularioCodigo {
  chaveNova: string;
  chaveAtual: string;
}

@Component({
  selector: 'app-config-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ModalReativacaoComponent],
  templateUrl: './config-funcionarios.html',
  styleUrl: './config-funcionarios.css'
})
export class ConfigFuncionariosComponent implements OnInit {

  funcionarios: Funcionario[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  idEmEdicao: number | null = null;
  form: FormularioFuncionario = this.formVazio();

  idAlterandoCodigo: number | null = null;
  formCodigo: FormularioCodigo = this.formCodigoVazio();
  salvandoCodigo = false;

  cargos: CargoFuncionario[] = ['GERENTE', 'RECEPCAO', 'GARCOM', 'COZINHA'];

  // Reativação de funcionário desativado (item 3 da V3)
  reativacao: EntidadeDesativada | null = null;
  cargoPendente: CargoFuncionario | null = null;
  reativando = false;

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit(): void {
    this.carregar();
  }

  private formVazio(): FormularioFuncionario {
    return { nome: '', codigo: '', cargo: null };
  }

  private formCodigoVazio(): FormularioCodigo {
    return { chaveNova: '', chaveAtual: '' };
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

    const cargo = this.form.cargo;

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
      error: (erro) => {
        this.salvando = false;

        // 409 ENTIDADE_DESATIVADA: já existe um funcionário com esse nome, desativado.
        if (!this.idEmEdicao && ehEntidadeDesativada(erro)) {
          this.reativacao = erro.error;
          this.cargoPendente = cargo;
          return;
        }

        // Demais casos (inclui 409 de nome duplicado ativo, que vem como lista).
        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível salvar o funcionário.');
      }
    });
  }

  // ===================== Reativar funcionário desativado =====================

  get mensagemReativacao(): string {
    return `Já existe um funcionário "${this.form.nome.trim()}" desativado. Deseja reativá-lo? ` +
      'Ele volta com o código de acesso que já tinha (o código digitado agora não é usado). ' +
      'Se você escolheu um cargo diferente do antigo, o cargo será atualizado.';
  }

  confirmarReativacao(): void {
    const alvo = this.reativacao;
    const cargo = this.cargoPendente;
    if (!alvo || !cargo || this.reativando) return;

    const nome = this.form.nome.trim();

    this.reativando = true;
    let reativado = false;

    this.funcionarioService.reativar(alvo.id).pipe(
      tap(() => (reativado = true)),
      // Se o cargo escolhido é diferente do antigo, envia o PUT em seguida.
      switchMap(antigo => this.mudou(antigo, cargo)
        ? this.funcionarioService.atualizar(alvo.id, { nome: antigo.nome, cargo })
        : of(antigo))
    ).subscribe({
      next: () => {
        this.reativando = false;
        this.reativacao = null;
        this.cargoPendente = null;
        this.cancelarEdicao();
        this.carregar();
      },
      error: (erro) => {
        this.reativando = false;
        this.reativacao = null;
        this.cargoPendente = null;

        if (reativado) {
          this.carregar();
          this.mensagemErro = `"${nome}" foi reativado, mas não foi possível atualizar o cargo. ` +
            mensagemDeErro(erro, 'Edite-o na lista.');
          return;
        }

        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível reativar o funcionário.');
      }
    });
  }

  /** "Não": volta ao formulário, para o usuário escolher outro nome. */
  cancelarReativacao(): void {
    if (this.reativando) return;
    this.reativacao = null;
    this.cargoPendente = null;
  }

  private mudou(antigo: FuncionarioDetalhamento, cargo: CargoFuncionario): boolean {
    return antigo.cargo !== cargo;
  }

  remover(funcionario: Funcionario): void {
    if (!confirm(`Remover o funcionário "${funcionario.nome}"?`)) return;

    this.funcionarioService.remover(funcionario.id).subscribe({
      next: () => this.carregar(),
      error: (erro) => (this.mensagemErro = mensagemDeErro(erro, `Não foi possível remover "${funcionario.nome}".`))
    });
  }

  iniciarAlteracaoCodigo(funcionario: Funcionario): void {
    this.idAlterandoCodigo = funcionario.id;
    this.formCodigo = this.formCodigoVazio();
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }

  cancelarAlteracaoCodigo(): void {
    this.idAlterandoCodigo = null;
    this.formCodigo = this.formCodigoVazio();
  }

  confirmarAlteracaoCodigo(funcionario: Funcionario): void {
    if (!this.formCodigo.chaveNova.trim() || !this.formCodigo.chaveAtual.trim()) {
      this.mensagemErro = 'Preencha o novo código e o código atual do funcionário.';
      return;
    }

    this.salvandoCodigo = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.funcionarioService.alterarCodigo(funcionario.id, {
      chaveNova: this.formCodigo.chaveNova.trim(),
      chaveAtual: this.formCodigo.chaveAtual
    }).subscribe({
      next: () => {
        this.salvandoCodigo = false;
        this.mensagemSucesso = `Código de "${funcionario.nome}" alterado com sucesso.`;
        this.cancelarAlteracaoCodigo();
      },
      error: () => {
        this.salvandoCodigo = false;
        this.mensagemErro = 'Não foi possível alterar o código. Verifique o código atual informado.';
      }
    });
  }
}