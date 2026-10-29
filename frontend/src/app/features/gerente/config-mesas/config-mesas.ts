import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { MesaService } from '../../../core/services/mesa.service';
import { DadosCadastroMesa, MesaDetalhamento, MesaListagem } from '../../../core/models/mesa.model';
import { EntidadeDesativada, ehEntidadeDesativada } from '../../../core/models/entidade-desativada.model';
import { mensagemDeErro } from '../../../core/utils/mensagem-erro';
import { ModalReativacaoComponent } from '../../../shared/components/modal-reativacao/modal-reativacao';

interface FormularioMesa {
  numero: number | null;
  capacidade: number | null;
}

@Component({
  selector: 'app-config-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ModalReativacaoComponent],
  templateUrl: './config-mesas.html',
  styleUrl: './config-mesas.css'
})
export class ConfigMesasComponent implements OnInit {

  mesas: MesaListagem[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';

  idEmEdicao: number | null = null;
  form: FormularioMesa = this.formVazio();

  // Reativação de mesa desativada (item 3 da V3)
  reativacao: EntidadeDesativada | null = null;
  dadosPendentes: DadosCadastroMesa | null = null;
  reativando = false;

  constructor(private mesaService: MesaService) {}

  ngOnInit(): void {
    this.carregar();
  }

  private formVazio(): FormularioMesa {
    return { numero: null, capacidade: null };
  }

  carregar(): void {
    this.carregando = true;
    this.mesaService.listarPorRestaurante().subscribe({
      next: (mesas) => {
        this.mesas = mesas;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar as mesas.';
      }
    });
  }

  editar(mesa: MesaListagem): void {
    this.idEmEdicao = mesa.id;
    this.form = { numero: mesa.numero, capacidade: mesa.capacidade };
  }

  cancelarEdicao(): void {
    this.idEmEdicao = null;
    this.form = this.formVazio();
  }

  salvar(): void {
    if (!this.form.numero || this.form.numero <= 0 || !this.form.capacidade || this.form.capacidade <= 0) {
      this.mensagemErro = 'Preencha número e capacidade (maiores que zero).';
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';

    const dados = { numero: this.form.numero, capacidade: this.form.capacidade };

    const requisicao$ = this.idEmEdicao
      ? this.mesaService.atualizar(this.idEmEdicao, dados)
      : this.mesaService.criar(dados);

    requisicao$.subscribe({
      next: () => {
        this.salvando = false;
        this.cancelarEdicao();
        this.carregar();
      },
      error: (erro) => {
        this.salvando = false;

        // 409 ENTIDADE_DESATIVADA: já existe uma mesa com esse número, desativada.
        if (!this.idEmEdicao && ehEntidadeDesativada(erro)) {
          this.reativacao = erro.error;
          this.dadosPendentes = dados;
          return;
        }

        // Demais casos (inclui 409 de número duplicado ativo, que vem como lista).
        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível salvar a mesa.');
      }
    });
  }

  // ===================== Reativar mesa desativada =====================

  get mensagemReativacao(): string {
    return `Já existe a mesa ${this.form.numero} desativada. Deseja reativá-la? ` +
      'Se você informou uma capacidade diferente da antiga, ela será atualizada.';
  }

  confirmarReativacao(): void {
    const alvo = this.reativacao;
    const dados = this.dadosPendentes;
    if (!alvo || !dados || this.reativando) return;

    this.reativando = true;
    let reativada = false;

    this.mesaService.reativar(alvo.id).pipe(
      tap(() => (reativada = true)),
      // Se o formulário trouxe dados diferentes dos antigos, envia o PUT em seguida.
      switchMap(antiga => this.mudou(antiga, dados)
        ? this.mesaService.atualizar(alvo.id, dados)
        : of(antiga))
    ).subscribe({
      next: () => {
        this.reativando = false;
        this.reativacao = null;
        this.dadosPendentes = null;
        this.cancelarEdicao();
        this.carregar();
      },
      error: (erro) => {
        this.reativando = false;
        this.reativacao = null;
        this.dadosPendentes = null;

        if (reativada) {
          this.carregar();
          this.mensagemErro = 'A mesa foi reativada, mas não foi possível atualizar a capacidade. ' +
            mensagemDeErro(erro, 'Edite-a na lista.');
          return;
        }

        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível reativar a mesa.');
      }
    });
  }

  /** "Não": volta ao formulário, para o usuário escolher outro número. */
  cancelarReativacao(): void {
    if (this.reativando) return;
    this.reativacao = null;
    this.dadosPendentes = null;
  }

  private mudou(antiga: MesaDetalhamento, dados: DadosCadastroMesa): boolean {
    return antiga.capacidade !== dados.capacidade;
  }

  remover(mesa: MesaListagem): void {
    if (!confirm(`Remover a mesa ${mesa.numero}?`)) return;

    this.mesaService.desativar(mesa.id).subscribe({
      next: () => this.carregar(),
      error: (erro) => (this.mensagemErro = mensagemDeErro(erro, `Não foi possível remover a mesa ${mesa.numero}.`))
    });
  }
}