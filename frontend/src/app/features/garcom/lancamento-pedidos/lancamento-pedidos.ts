import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MesaService } from '../../../core/services/mesa.service';
import { ProdutoService } from '../../../core/services/produto.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { ItemPedidoService } from '../../../core/services/item-pedido.service';
import { AuthService } from '../../../core/services/auth.service';

import { MesaListagem } from '../../../core/models/mesa.model';
import { ProdutoListagem } from '../../../core/models/produto.model';
import { DadosCadastroItemPedido } from '../../../core/models/pedido.model';
import { StatusItemPedido } from '../../../core/models/item-pedido.model';

interface ItemCarrinho {
  idProduto: number;
  nomeProduto: string;
  quantidade: number;
  observacao: string;
}

/** Um item já enviado, junto com os dados do pedido/mesa/produto a que pertence. */
interface ItemAcompanhamento {
  idPedido: number;
  idItemPedido: number;
  numeroMesa: number | string;
  nomeProduto: string;
  quantidade: number;
  status: StatusItemPedido;
  dataHora: string;
}

interface Filtro {
  rotulo: string;
  valor: 'todos' | StatusItemPedido;
}

const INTERVALO_ATUALIZACAO_MS = 15000;

@Component({
  selector: 'app-lancamento-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lancamento-pedidos.html',
  styleUrl: './lancamento-pedidos.css'
})
export class LancamentoPedidosComponent implements OnInit, OnDestroy {

  nomeGarcom = '';
  abaAtiva: 'novo' | 'andamento' = 'novo';

  // ---------- Novo pedido ----------
  mesas: MesaListagem[] = [];
  produtos: ProdutoListagem[] = [];
  mesaSelecionada: number | null = null;
  produtoSelecionado: number | null = null;
  quantidadeSelecionada = 1;
  observacaoItem = '';
  observacaoPedido = '';
  carrinho: ItemCarrinho[] = [];
  enviando = false;

  // ---------- Em andamento ----------
  itensAcompanhamento: ItemAcompanhamento[] = [];
  carregando = false;
  filtroAtivo: 'todos' | StatusItemPedido = 'todos';
  filtros: Filtro[] = [
    { rotulo: 'Todos', valor: 'todos' },
    { rotulo: 'Pendentes', valor: 'PENDENTE' },
    { rotulo: 'Em preparo', valor: 'EM_PREPARO' },
    { rotulo: 'Prontos', valor: 'PRONTO' },
    { rotulo: 'Entregues', valor: 'ENTREGUE' }
  ];

  mensagemErro = '';

  private funcionarioId!: number;
  private polling?: Subscription;

  constructor(
    private mesaService: MesaService,
    private produtoService: ProdutoService,
    private pedidoService: PedidoService,
    private itemPedidoService: ItemPedidoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const sessao = this.authService.getSessao();
    this.nomeGarcom = sessao?.nomeFuncionario ?? '';
    this.funcionarioId = sessao?.funcionarioId!;

    this.mesaService.listarPorRestaurante().subscribe(mesas => (this.mesas = mesas));
    this.produtoService.listarPorRestaurante().subscribe(produtos => (this.produtos = produtos));

    this.carregarAndamento();
    this.polling = interval(INTERVALO_ATUALIZACAO_MS).subscribe(() => this.carregarAndamento());
  }

  ngOnDestroy(): void {
    this.polling?.unsubscribe();
  }

  // ===================== Novo pedido =====================

  adicionarAoCarrinho(): void {
    if (!this.produtoSelecionado || this.quantidadeSelecionada < 1) return;

    const produto = this.produtos.find(p => p.id === this.produtoSelecionado);
    if (!produto) return;

    this.carrinho.push({
      idProduto: produto.id,
      nomeProduto: produto.nome,
      quantidade: this.quantidadeSelecionada,
      observacao: this.observacaoItem.trim()
    });

    this.produtoSelecionado = null;
    this.quantidadeSelecionada = 1;
    this.observacaoItem = '';
  }

  removerDoCarrinho(index: number): void {
    this.carrinho.splice(index, 1);
  }

  podeEnviar(): boolean {
    return !!this.mesaSelecionada && this.carrinho.length > 0 && !this.enviando;
  }

  enviarPedido(): void {
    if (!this.podeEnviar()) return;

    const itens: DadosCadastroItemPedido[] = this.carrinho.map(item => ({
      idProduto: item.idProduto,
      quantidade: item.quantidade,
      observacao: item.observacao || undefined
    }));

    this.enviando = true;
    this.mensagemErro = '';

    this.pedidoService.criar({
      idMesa: this.mesaSelecionada!,
      idFuncionario: this.funcionarioId,
      observacao: this.observacaoPedido.trim() || undefined,
      itens
    }).subscribe({
      next: () => {
        this.enviando = false;
        this.mesaSelecionada = null;
        this.carrinho = [];
        this.observacaoPedido = '';
        this.abaAtiva = 'andamento';
        this.carregarAndamento();
      },
      error: () => {
        this.enviando = false;
        this.mensagemErro = 'Não foi possível enviar o pedido para a cozinha.';
      }
    });
  }

  // ===================== Em andamento =====================

  carregarAndamento(): void {
    this.carregando = this.itensAcompanhamento.length === 0;
    this.mensagemErro = '';

    this.pedidoService.listar(undefined, this.funcionarioId).subscribe({
      next: (pedidos) => {
        if (pedidos.length === 0) {
          this.itensAcompanhamento = [];
          this.carregando = false;
          return;
        }

        const chamadas = pedidos.map(pedido =>
          this.itemPedidoService.listarPorPedido(pedido.id).pipe(
            map(itens => itens.map(item => ({
              idPedido: pedido.id,
              idItemPedido: item.id,
              numeroMesa: this.mesas.find(m => m.id === pedido.idMesa)?.numero ?? pedido.idMesa,
              nomeProduto: this.produtos.find(p => p.id === item.idProduto)?.nome ?? `Produto #${item.idProduto}`,
              quantidade: item.quantidade,
              status: item.status,
              dataHora: pedido.dataHora
            } as ItemAcompanhamento))),
            catchError(() => of([] as ItemAcompanhamento[]))
          )
        );

        forkJoin(chamadas).subscribe(listas => {
          this.itensAcompanhamento = listas.flat();
          this.carregando = false;
        });
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível atualizar os pedidos.';
      }
    });
  }

  itensFiltrados(): ItemAcompanhamento[] {
    if (this.filtroAtivo === 'todos') return this.itensAcompanhamento;
    return this.itensAcompanhamento.filter(i => i.status === this.filtroAtivo);
  }

  statusRotulo(status: StatusItemPedido): string {
    switch (status) {
      case 'PENDENTE': return 'Pendente';
      case 'EM_PREPARO': return 'Em preparo';
      case 'PRONTO': return 'Pronto';
      case 'ENTREGUE': return 'Entregue';
      case 'CANCELADO': return 'Cancelado';
    }
  }

  marcarComoEntregue(item: ItemAcompanhamento): void {
    if (item.status !== 'PRONTO') return;

    const statusAnterior = item.status;
    item.status = 'ENTREGUE';

    this.itemPedidoService.entregar(item.idPedido, item.idItemPedido).subscribe({
      error: () => {
        item.status = statusAnterior;
        this.mensagemErro = 'Não foi possível marcar o item como entregue.';
      }
    });
  }
}