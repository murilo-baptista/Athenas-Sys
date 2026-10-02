import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { PedidoService } from '../../../core/services/pedido.service';
import { ItemPedidoService } from '../../../core/services/item-pedido.service';
import { MesaService } from '../../../core/services/mesa.service';
import { ProdutoService } from '../../../core/services/produto.service';
import { StatusItemPedido } from '../../../core/models/item-pedido.model';

interface ItemKds {
  idPedido: number;
  idItemPedido: number;
  numeroMesa: number | string;
  nomeProduto: string;
  quantidade: number;
  observacao: string | null;
  status: StatusItemPedido;
  dataHoraPedido: string;
}

interface Filtro {
  rotulo: string;
  valor: 'todos' | StatusItemPedido;
}

const INTERVALO_ATUALIZACAO_MS = 10000;

@Component({
  selector: 'app-painel-kds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './painel-kds.html',
  styleUrl: './painel-kds.css'
})
export class PainelKdsComponent implements OnInit, OnDestroy {

  filtroAtivo: 'todos' | StatusItemPedido = 'todos';

  filtros: Filtro[] = [
    { rotulo: 'Todos', valor: 'todos' },
    { rotulo: 'Pendentes', valor: 'PENDENTE' },
    { rotulo: 'Em preparo', valor: 'EM_PREPARO' },
    { rotulo: 'Prontos', valor: 'PRONTO' },
    { rotulo: 'Entregues', valor: 'ENTREGUE' }
  ];

  itens: ItemKds[] = [];
  carregando = false;
  mensagemErro = '';

  private polling?: Subscription;

  constructor(
    private pedidoService: PedidoService,
    private itemPedidoService: ItemPedidoService,
    private mesaService: MesaService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.carregarPainel();
    this.polling = interval(INTERVALO_ATUALIZACAO_MS).subscribe(() => this.carregarPainel());
  }

  ngOnDestroy(): void {
    this.polling?.unsubscribe();
  }

  private carregarPainel(): void {
    this.carregando = this.itens.length === 0;
    this.mensagemErro = '';

    forkJoin({
      mesas: this.mesaService.listarPorRestaurante().pipe(catchError(() => of([]))),
      produtos: this.produtoService.listarPorRestaurante().pipe(catchError(() => of([]))),
      pedidos: this.pedidoService.listar()
    }).subscribe({
      next: ({ mesas, produtos, pedidos }) => {
        if (pedidos.length === 0) {
          this.itens = [];
          this.carregando = false;
          return;
        }

        const chamadas = pedidos.map(pedido =>
          this.itemPedidoService.listarPorPedido(pedido.id).pipe(
            map(itens => itens.map(item => ({
              idPedido: pedido.id,
              idItemPedido: item.id,
              numeroMesa: mesas.find(m => m.id === pedido.idMesa)?.numero ?? pedido.idMesa,
              nomeProduto: produtos.find(p => p.id === item.idProduto)?.nome ?? `Produto #${item.idProduto}`,
              quantidade: item.quantidade,
              observacao: item.observacao,
              status: item.status,
              dataHoraPedido: pedido.dataHora
            } as ItemKds))),
            catchError(() => of([] as ItemKds[]))
          )
        );

        forkJoin(chamadas).subscribe(listas => {
          this.itens = listas.flat().filter(i => i.status !== 'CANCELADO');
          this.carregando = false;
        });
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível atualizar o painel de pedidos.';
      }
    });
  }

  itensFiltrados(): ItemKds[] {
    if (this.filtroAtivo === 'todos') return this.itens;
    return this.itens.filter(i => i.status === this.filtroAtivo);
  }

  statusRotulo(status: StatusItemPedido): string {
    switch (status) {
      case 'PENDENTE': return 'Aguardando preparo';
      case 'EM_PREPARO': return 'Em preparo';
      case 'PRONTO': return 'Pronto';
      case 'ENTREGUE': return 'Entregue';
      case 'CANCELADO': return 'Cancelado';
    }
  }

  podePreparar(item: ItemKds): boolean {
    return item.status === 'PENDENTE';
  }

  podeMarcarPronto(item: ItemKds): boolean {
    return item.status === 'EM_PREPARO';
  }

  marcarComoEmPreparo(item: ItemKds): void {
    if (!this.podePreparar(item)) return;

    const anterior = item.status;
    item.status = 'EM_PREPARO';

    this.itemPedidoService.preparar(item.idPedido, item.idItemPedido).subscribe({
      error: () => {
        item.status = anterior;
        this.mensagemErro = 'Não foi possível iniciar o preparo desse item.';
      }
    });
  }

  marcarComoPronto(item: ItemKds): void {
    if (!this.podeMarcarPronto(item)) return;

    const anterior = item.status;
    item.status = 'PRONTO';

    this.itemPedidoService.marcarPronto(item.idPedido, item.idItemPedido).subscribe({
      error: () => {
        item.status = anterior;
        this.mensagemErro = 'Não foi possível marcar esse item como pronto.';
      }
    });
  }
}