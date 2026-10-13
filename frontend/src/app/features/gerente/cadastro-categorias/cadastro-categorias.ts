import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { CategoriaListagem } from '../../../core/models/categoria.model';
import { ProdutoService } from '../../../core/services/produto.service';
import { ProdutoListagem } from '../../../core/models/produto.model';

@Component({
  selector: 'app-cadastro-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-categorias.html',
  styleUrl: './cadastro-categorias.css'
})
export class CadastroCategoriasComponent implements OnInit {

  categorias: CategoriaListagem[] = [];
  produtos: ProdutoListagem[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';

  idEmEdicao: number | null = null;
  nome = '';

  constructor(
    private categoriaService: CategoriaService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.carregar();
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

    // carregado à parte, só para contar produtos por categoria no aviso de remoção
    this.produtoService.listarPorRestaurante().subscribe({
      next: (produtos) => (this.produtos = produtos)
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
      error: () => {
        this.salvando = false;
        this.mensagemErro = 'Não foi possível salvar a categoria.';
      }
    });
  }

  remover(categoria: CategoriaListagem): void {
    const quantidadeProdutos = this.produtos.filter(p => p.idCategoria === categoria.id).length;

    const mensagem = quantidadeProdutos > 0
      ? `Esta categoria tem ${quantidadeProdutos} produto(s). Eles também serão desativados. Deseja continuar?`
      : `Remover a categoria "${categoria.nome}"?`;

    if (!confirm(mensagem)) {
      return;
    }

    this.categoriaService.desativar(categoria.id).subscribe({
      next: () => this.carregar(), // recarrega categorias e produtos, já que os produtos saem da lista
      error: () => (this.mensagemErro = `Não foi possível remover "${categoria.nome}".`)
    });
  }
}