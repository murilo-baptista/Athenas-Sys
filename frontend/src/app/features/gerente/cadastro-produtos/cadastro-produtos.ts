import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { ProdutoService } from '../../../core/services/produto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { DadosCadastroProduto, ProdutoDetalhamento, ProdutoListagem } from '../../../core/models/produto.model';
import { CategoriaListagem } from '../../../core/models/categoria.model';
import { EntidadeDesativada, ehEntidadeDesativada } from '../../../core/models/entidade-desativada.model';
import { mensagemDeErro } from '../../../core/utils/mensagem-erro';
import { ModalReativacaoComponent } from '../../../shared/components/modal-reativacao/modal-reativacao';

interface FormularioProduto {
  nome: string;
  descricao: string;
  preco: number | null;
  idCategoria: number | null;
}

@Component({
  selector: 'app-cadastro-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ModalReativacaoComponent],
  templateUrl: './cadastro-produtos.html',
  styleUrl: './cadastro-produtos.css'
})
export class CadastroProdutosComponent implements OnInit {

  produtos: ProdutoListagem[] = [];
  categorias: CategoriaListagem[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';

  idEmEdicao: number | null = null;
  form: FormularioProduto = this.formVazio();

  // Reativação de produto desativado (item 3 da V3)
  reativacao: EntidadeDesativada | null = null;
  dadosPendentes: DadosCadastroProduto | null = null;
  reativando = false;

  constructor(
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.categoriaService.listarPorRestaurante().subscribe(categorias => (this.categorias = categorias));
    this.carregar();
  }

  private formVazio(): FormularioProduto {
    return { nome: '', descricao: '', preco: null, idCategoria: null };
  }

  carregar(): void {
    this.carregando = true;
    this.produtoService.listarPorRestaurante().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar os produtos.';
      }
    });
  }

  nomeCategoria(idCategoria: number): string {
    return this.categorias.find(c => c.id === idCategoria)?.nome ?? '—';
  }

  editar(produto: ProdutoListagem): void {
    this.idEmEdicao = produto.id;
    this.form = {
      nome: produto.nome,
      descricao: produto.descricao ?? '',
      preco: produto.preco,
      idCategoria: produto.idCategoria
    };
  }

  cancelarEdicao(): void {
    this.idEmEdicao = null;
    this.form = this.formVazio();
  }

  salvar(): void {
    if (!this.form.nome.trim() || !this.form.preco || this.form.preco <= 0 || !this.form.idCategoria) {
      this.mensagemErro = 'Preencha nome, preço (maior que zero) e categoria.';
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';

    const dados = {
      nome: this.form.nome.trim(),
      descricao: this.form.descricao.trim() || undefined,
      preco: this.form.preco,
      idCategoria: this.form.idCategoria
    };

    const requisicao$ = this.idEmEdicao
      ? this.produtoService.atualizar(this.idEmEdicao, dados)
      : this.produtoService.criar(dados);

    requisicao$.subscribe({
      next: () => {
        this.salvando = false;
        this.cancelarEdicao();
        this.carregar();
      },
      error: (erro) => {
        this.salvando = false;

        // 409 ENTIDADE_DESATIVADA: já existe um produto com esse nome, desativado.
        if (!this.idEmEdicao && ehEntidadeDesativada(erro) && erro.error.entidade === 'produto') {
          this.reativacao = erro.error;
          this.dadosPendentes = dados;
          return;
        }

        // Demais casos (inclui 409 de nome duplicado ativo, que vem como lista).
        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível salvar o produto.');
      }
    });
  }

  // ===================== Reativar produto desativado =====================

  get mensagemReativacao(): string {
    return `Já existe um produto "${this.form.nome.trim()}" desativado. Deseja reativá-lo? ` +
      'Se você informou preço, descrição ou categoria diferentes dos antigos, eles serão atualizados.';
  }

  confirmarReativacao(): void {
    const alvo = this.reativacao;
    const dados = this.dadosPendentes;
    if (!alvo || !dados || this.reativando) return;

    this.reativando = true;
    let reativado = false;

    this.produtoService.reativar(alvo.id).pipe(
      tap(() => (reativado = true)),
      // Se o formulário trouxe dados diferentes dos antigos, envia o PUT em seguida.
      switchMap(antigo => this.mudou(antigo, dados)
        ? this.produtoService.atualizar(alvo.id, dados)
        : of(antigo))
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

        if (reativado) {
          // Reativou, mas o PUT falhou: o produto já voltou com os dados antigos.
          this.carregar();
          this.mensagemErro = 'O produto foi reativado, mas não foi possível atualizar os dados. ' +
            mensagemDeErro(erro, 'Edite-o na lista.');
          return;
        }

        // Ex.: 409 pedindo para reativar a categoria antes (mostra a mensagem do back).
        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível reativar o produto.');
      }
    });
  }

  /** "Não": volta ao formulário, para o usuário escolher outro nome. */
  cancelarReativacao(): void {
    if (this.reativando) return;
    this.reativacao = null;
    this.dadosPendentes = null;
  }

  private mudou(antigo: ProdutoDetalhamento, dados: DadosCadastroProduto): boolean {
    return Number(antigo.preco) !== dados.preco
      || (antigo.descricao ?? '') !== (dados.descricao ?? '')
      || antigo.idCategoria !== dados.idCategoria;
  }

  remover(produto: ProdutoListagem): void {
    if (!confirm(`Remover o produto "${produto.nome}"?`)) return;

    this.produtoService.desativar(produto.id).subscribe({
      next: () => this.carregar(),
      error: (erro) => (this.mensagemErro = mensagemDeErro(erro, `Não foi possível remover "${produto.nome}".`))
    });
  }
}