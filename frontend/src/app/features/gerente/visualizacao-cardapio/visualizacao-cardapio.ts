import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ProdutoService } from '../../../core/services/produto.service';
import { CategoriaListagem } from '../../../core/models/categoria.model';
import { ProdutoListagem } from '../../../core/models/produto.model';

interface CategoriaComProdutos {
  id: number;
  nome: string;
  produtos: ProdutoListagem[];
}

@Component({
  selector: 'app-visualizacao-cardapio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './visualizacao-cardapio.html'
})
export class VisualizacaoCardapioComponent implements OnInit {

  categorias: CategoriaComProdutos[] = [];
  carregando = false;
  mensagemErro = '';

  constructor(
    private categoriaService: CategoriaService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.categoriaService.listarPorRestaurante().subscribe({
      next: (categorias) => {
        this.produtoService.listarPorRestaurante().subscribe({
          next: (produtos) => {
            this.categorias = this.agruparPorCategoria(categorias, produtos);
            this.carregando = false;
          },
          error: () => {
            this.carregando = false;
            this.mensagemErro = 'Não foi possível carregar os produtos do cardápio.';
          }
        });
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar as categorias do cardápio.';
      }
    });
  }

  private agruparPorCategoria(
    categorias: CategoriaListagem[],
    produtos: ProdutoListagem[]
  ): CategoriaComProdutos[] {
    return categorias.map(categoria => ({
      id: categoria.id,
      nome: categoria.nome,
      produtos: produtos.filter(produto => produto.idCategoria === categoria.id)
    }));
  }
}