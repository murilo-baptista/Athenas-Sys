import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ProdutoService } from '../../../core/services/produto.service';
import { CategoriaListagem } from '../../../core/models/categoria.model';
import { ProdutoListagem } from '../../../core/models/produto.model';

interface CategoriaComProdutos {
  id: number;
  nome: string;
  produtos: ProdutoListagem[];
}

const COR_FUNDO = '#FFF8EE';

@Component({
  selector: 'app-visualizacao-cardapio',
  standalone: true,
  imports: [CommonModule, RouterLink, QRCodeComponent],
  templateUrl: './visualizacao-cardapio.html'
})
export class VisualizacaoCardapioComponent implements OnInit {

  @ViewChild('areaCardapio') areaCardapio!: ElementRef<HTMLElement>;

  categorias: CategoriaComProdutos[] = [];
  carregando = false;
  exportando = false;
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

  // ===================== Exportação =====================

  podeExportar(): boolean {
    return !this.carregando && !this.exportando && this.categorias.length > 0;
  }

  private gerarCanvas(): Promise<HTMLCanvasElement> {
    return html2canvas(this.areaCardapio.nativeElement, {
      scale: 2,
      backgroundColor: COR_FUNDO
    });
  }

  async salvarImagem(): Promise<void> {
    if (!this.podeExportar()) return;

    this.exportando = true;
    this.mensagemErro = '';

    try {
      const canvas = await this.gerarCanvas();
      const link = document.createElement('a');
      link.download = 'cardapio.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      this.mensagemErro = 'Não foi possível gerar a imagem do cardápio.';
    } finally {
      this.exportando = false;
    }
  }

  async salvarPdf(): Promise<void> {
    if (!this.podeExportar()) return;

    this.exportando = true;
    this.mensagemErro = '';

    try {
      const canvas = await this.gerarCanvas();

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const larguraPagina = pdf.internal.pageSize.getWidth();
      const alturaPagina = pdf.internal.pageSize.getHeight();
      const margem = 10;
      const larguraUtil = larguraPagina - margem * 2;
      const alturaUtil = alturaPagina - margem * 2;

      // Quantos pixels do canvas cabem em uma página do PDF.
      const pixelsPorPagina = Math.floor((alturaUtil * canvas.width) / larguraUtil);

      let posicaoPx = 0;
      let primeiraPagina = true;

      while (posicaoPx < canvas.height) {
        const alturaFatia = Math.min(pixelsPorPagina, canvas.height - posicaoPx);

        const fatia = document.createElement('canvas');
        fatia.width = canvas.width;
        fatia.height = alturaFatia;

        const contexto = fatia.getContext('2d');
        if (!contexto) throw new Error('Canvas indisponível');

        contexto.fillStyle = COR_FUNDO;
        contexto.fillRect(0, 0, fatia.width, fatia.height);
        contexto.drawImage(canvas, 0, posicaoPx, canvas.width, alturaFatia, 0, 0, canvas.width, alturaFatia);

        if (!primeiraPagina) pdf.addPage();

        pdf.setFillColor(255, 248, 238);
        pdf.rect(0, 0, larguraPagina, alturaPagina, 'F');
        pdf.addImage(
          fatia.toDataURL('image/png'),
          'PNG',
          margem,
          margem,
          larguraUtil,
          (alturaFatia * larguraUtil) / canvas.width
        );

        posicaoPx += alturaFatia;
        primeiraPagina = false;
      }

      pdf.save('cardapio.pdf');
    } catch {
      this.mensagemErro = 'Não foi possível gerar o PDF do cardápio.';
    } finally {
      this.exportando = false;
    }
  }
}