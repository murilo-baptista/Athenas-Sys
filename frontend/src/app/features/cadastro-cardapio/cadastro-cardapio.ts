import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriaService } from '../../core/services/categoria.service';
import { ProdutoService } from '../../core/services/produto.service';
import { AuthService } from '../../core/services/auth.service';
import { CategoriaListagem } from '../../core/models/categoria.model';
import { ProdutoListagem } from '../../core/models/produto.model';
import { BannerAthenasComponent } from '../../shared/components/banner-athenas/banner-athenas';

@Component({
  selector: 'app-cadastro-cardapio',
  standalone: true,
  imports: [CommonModule, FormsModule, BannerAthenasComponent],
  templateUrl: './cadastro-cardapio.html',
  styleUrl: './cadastro-cardapio.css'
})
export class CadastroCardapioComponent implements OnInit {

  // ---------- Categoria ----------
  nomeCategoria = '';
  categorias: CategoriaListagem[] = [];
  salvandoCategoria = false;
  removendoCategoriaId: number | null = null;

  // ---------- Produto ----------
  nomeProduto = '';
  descricaoProduto = '';
  precoProduto: number | null = null;
  categoriaSelecionada: number | null = null;
  produtos: ProdutoListagem[] = [];
  salvandoProduto = false;
  removendoProdutoId: number | null = null;

  carregando = false;
  mensagemErro = '';

  constructor(
    private router: Router,
    private categoriaService: CategoriaService,
    private produtoService: ProdutoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.getIdRestaurante()) {
      this.router.navigate(['/cadastro-restaurante']);
      return;
    }
    this.carregarTudo();
  }

  private carregarTudo(): void {
    this.carregando = true;
    this.categoriaService.listarPorRestaurante().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar as categorias já cadastradas.';
      }
    });

    this.produtoService.listarPorRestaurante().subscribe({
      next: (produtos) => (this.produtos = produtos)
    });
  }

  nomeDaCategoria(idCategoria: number): string {
    return this.categorias.find(c => c.id === idCategoria)?.nome ?? '—';
  }

  adicionarCategoria(): void {
    this.mensagemErro = '';
    if (!this.nomeCategoria.trim()) return;

    this.salvandoCategoria = true;

    this.categoriaService.criar({ nome: this.nomeCategoria.trim() }).subscribe({
      next: (categoriaCriada) => {
        this.categorias.push(categoriaCriada);
        this.nomeCategoria = '';
        this.salvandoCategoria = false;
      },
      error: () => {
        this.salvandoCategoria = false;
        this.mensagemErro = 'Não foi possível adicionar essa categoria. Tente novamente.';
      }
    });
  }

  removerCategoria(categoria: CategoriaListagem): void {
    if (this.removendoCategoriaId !== null) return;

    // No back, desativar a categoria também desativa os produtos dela: avisa antes
    const quantidade = this.produtos.filter(p => p.idCategoria === categoria.id).length;
    if (quantidade > 0) {
      const textoProdutos = quantidade === 1 ? '1 produto' : `${quantidade} produtos`;
      const confirmou = window.confirm(
        `Esta categoria tem ${textoProdutos}. Eles também serão desativados. Deseja continuar?`
      );
      if (!confirmou) return;
    }

    this.mensagemErro = '';
    this.removendoCategoriaId = categoria.id;

    this.categoriaService.desativar(categoria.id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter(c => c.id !== categoria.id);
        if (this.categoriaSelecionada === categoria.id) {
          this.categoriaSelecionada = null;
        }
        this.removendoCategoriaId = null;

        // Os produtos da categoria deixam de aparecer: recarrega a lista
        this.produtoService.listarPorRestaurante().subscribe({
          next: (produtos) => (this.produtos = produtos)
        });
      },
      error: () => {
        this.removendoCategoriaId = null;
        this.mensagemErro = 'Não foi possível remover essa categoria. Tente novamente.';
      }
    });
  }

  adicionarProduto(): void {
    this.mensagemErro = '';

    if (!this.nomeProduto.trim() || !this.precoProduto || !this.categoriaSelecionada) {
      this.mensagemErro = 'Preencha nome, preço e categoria do produto.';
      return;
    }

    this.salvandoProduto = true;

    this.produtoService.criar({
      nome: this.nomeProduto.trim(),
      descricao: this.descricaoProduto.trim() || undefined,
      preco: this.precoProduto,
      idCategoria: this.categoriaSelecionada
    }).subscribe({
      next: (produtoCriado) => {
        this.produtos.push(produtoCriado);
        this.nomeProduto = '';
        this.descricaoProduto = '';
        this.precoProduto = null;
        this.salvandoProduto = false;
      },
      error: () => {
        this.salvandoProduto = false;
        this.mensagemErro = 'Não foi possível adicionar esse produto. Tente novamente.';
      }
    });
  }

  removerProduto(produto: ProdutoListagem): void {
    if (this.removendoProdutoId !== null) return;

    this.mensagemErro = '';
    this.removendoProdutoId = produto.id;

    this.produtoService.desativar(produto.id).subscribe({
      next: () => {
        this.produtos = this.produtos.filter(p => p.id !== produto.id);
        this.removendoProdutoId = null;
      },
      error: () => {
        this.removendoProdutoId = null;
        this.mensagemErro = 'Não foi possível remover esse produto. Tente novamente.';
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/cadastro-funcionarios']);
  }

  finalizar(): void {
    // Onboarding concluído: encerra a sessão temporária e leva ao login definitivo.
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}