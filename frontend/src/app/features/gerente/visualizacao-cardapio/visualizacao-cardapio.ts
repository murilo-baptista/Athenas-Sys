import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
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
  imports: [CommonModule, RouterLink, QRCodeComponent],
  templateUrl: './visualizacao-cardapio.html'
})
export class VisualizacaoCardapioComponent implements OnInit {

  categorias: CategoriaComProdutos[] = [];
  carregando = false;
  mensagemErro = '';

  mostrarQrCode = false;
  urlCardapio = '';

  constructor(
    private categoriaService: CategoriaService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    // Por enquanto, o QR Code aponta para esta mesma página. Uma versão
    // pública/estática do cardápio, sem exigir login, é um passo futuro.
    this.urlCardapio = window.location.href;
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

  alternarQrCode(): void {
    this.mostrarQrCode = !this.mostrarQrCode;
  }
}