import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../../../core/services/produto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ProdutoListagem } from '../../../core/models/produto.model';
import { CategoriaListagem } from '../../../core/models/categoria.model';

interface FormularioProduto {
  nome: string;
  descricao: string;
  preco: number | null;
  idCategoria: number | null;
}

@Component({
  selector: 'app-cadastro-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-produtos.html'
})
export class CadastroProdutosComponent implements OnInit {

  produtos: ProdutoListagem[] = [];
  categorias: CategoriaListagem[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';

  idEmEdicao: number | null = null;
  form: FormularioProduto = this.formVazio();

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
      error: () => {
        this.salvando = false;
        this.mensagemErro = 'Não foi possível salvar o produto.';
      }
    });
  }

  remover(produto: ProdutoListagem): void {
    if (!confirm(`Remover o produto "${produto.nome}"?`)) return;

    this.produtoService.desativar(produto.id).subscribe({
      next: () => this.carregar(),
      error: () => (this.mensagemErro = `Não foi possível remover "${produto.nome}".`)
    });
  }
}
