import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ProdutoService } from '../../../core/services/produto.service';
import { CategoriaListagem } from '../../../core/models/categoria.model';
import { ProdutoListagem } from '../../../core/models/produto.model';
import { EntidadeDesativada, ehEntidadeDesativada } from '../../../core/models/entidade-desativada.model';
import { mensagemDeErro } from '../../../core/utils/mensagem-erro';
import { ModalReativacaoComponent } from '../../../shared/components/modal-reativacao/modal-reativacao';

@Component({
  selector: 'app-cadastro-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ModalReativacaoComponent],
  templateUrl: './cadastro-categorias.html',
  styleUrl: './cadastro-categorias.css'
})
export class CadastroCategoriasComponent implements OnInit {

  categorias: CategoriaListagem[] = [];
  produtos: ProdutoListagem[] = [];
  produtosCarregados = false;
  carregando = false;
  salvando = false;
  mensagemErro = '';

  idEmEdicao: number | null = null;
  nome = '';

  // Confirmação de remoção (item 2 da V3)
  categoriaParaRemover: CategoriaListagem | null = null;
  produtosDaCategoria = 0;
  removendo = false;

  // Reativação de categoria desativada (item 3 da V3)
  reativacao: EntidadeDesativada | null = null;
  reativando = false;

  constructor(
    private categoriaService: CategoriaService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.carregarProdutos();
  }

  carregar(): void {
    this.carregando = true;
    this.categoriaService.listarPorRestaurante().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar as categorias.';
      }
    });
  }

  /** A lista de produtos é usada só para contar quantos pertencem a cada categoria. */
  carregarProdutos(): void {
    this.produtoService.listarPorRestaurante().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.produtosCarregados = true;
      },
      error: () => {
        this.produtos = [];
        this.produtosCarregados = false;
      }
    });
  }

  editar(categoria: CategoriaListagem): void {
    this.idEmEdicao = categoria.id;
    this.nome = categoria.nome;
  }

  cancelarEdicao(): void {
    this.idEmEdicao = null;
    this.nome = '';
  }

  salvar(): void {
    if (!this.nome.trim()) {
      this.mensagemErro = 'Informe o nome da categoria.';
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';
    const dados = { nome: this.nome.trim() };

    const requisicao$ = this.idEmEdicao
      ? this.categoriaService.atualizar(this.idEmEdicao, dados)
      : this.categoriaService.criar(dados);

    requisicao$.subscribe({
      next: () => {
        this.salvando = false;
        this.cancelarEdicao();
        this.carregar();
      },
      error: (erro) => {
        this.salvando = false;

        // 409 ENTIDADE_DESATIVADA: já existe uma categoria com esse nome, desativada.
        if (!this.idEmEdicao && ehEntidadeDesativada(erro)) {
          this.reativacao = erro.error;
          return;
        }

        // Demais casos (inclui 409 de nome duplicado ativo, que vem como lista).
        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível salvar a categoria.');
      }
    });
  }

  // ===================== Reativar categoria desativada =====================

  get mensagemReativacao(): string {
    return `Já existe uma categoria "${this.nome.trim()}" desativada. Deseja reativá-la?`;
  }

  confirmarReativacao(): void {
    const alvo = this.reativacao;
    if (!alvo || this.reativando) return;

    this.reativando = true;

    this.categoriaService.reativar(alvo.id).subscribe({
      next: () => {
        this.reativando = false;
        this.reativacao = null;
        this.cancelarEdicao();
        // Reativar a categoria não reativa os produtos dela: cada um volta separadamente.
        this.carregar();
      },
      error: (erro) => {
        this.reativando = false;
        this.reativacao = null;
        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível reativar a categoria.');
      }
    });
  }

  /** "Não": volta ao formulário, para o usuário escolher outro nome. */
  cancelarReativacao(): void {
    if (this.reativando) return;
    this.reativacao = null;
  }

  // ===================== Remover categoria =====================

  remover(categoria: CategoriaListagem): void {
    this.mensagemErro = '';
    this.produtosDaCategoria = this.produtos.filter(p => p.idCategoria === categoria.id).length;
    this.categoriaParaRemover = categoria;
  }

  cancelarRemocao(): void {
    if (this.removendo) return;
    this.categoriaParaRemover = null;
  }

  /** Texto do aviso: usa a contagem de produtos da lista já carregada. */
  get avisoRemocao(): string {
    const n = this.produtosDaCategoria;

    if (n > 0) {
      return n === 1
        ? 'Esta categoria tem 1 produto. Ele também será desativado. Deseja continuar?'
        : `Esta categoria tem ${n} produtos. Eles também serão desativados. Deseja continuar?`;
    }

    // Se a lista de produtos não carregou, não dá para afirmar que está vazia.
    return this.produtosCarregados
      ? 'Deseja continuar?'
      : 'Os produtos desta categoria, se houver, também serão desativados. Deseja continuar?';
  }

  confirmarRemocao(): void {
    const categoria = this.categoriaParaRemover;
    if (!categoria || this.removendo) return;

    this.removendo = true;

    this.categoriaService.desativar(categoria.id).subscribe({
      next: () => {
        this.removendo = false;
        this.categoriaParaRemover = null;
        this.carregar();
        // Os produtos da categoria deixam de aparecer: atualiza a lista.
        this.carregarProdutos();
      },
      error: (erro) => {
        this.removendo = false;
        this.categoriaParaRemover = null;
        this.mensagemErro = erro.status === 403
          ? 'Você não tem permissão para remover categorias.'
          : `Não foi possível remover "${categoria.nome}".`;
      }
    });
  }
}