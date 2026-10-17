import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MesaService } from '../../../core/services/mesa.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { ItemPedidoService } from '../../../core/services/item-pedido.service';
import { ProdutoService } from '../../../core/services/produto.service';
import { AuthService } from '../../../core/services/auth.service';

import { MesaListagem } from '../../../core/models/mesa.model';
import { ProdutoListagem } from '../../../core/models/produto.model';
import { StatusItemPedido } from '../../../core/models/item-pedido.model';

interface LinhaConta {
  idPedido: number;
  nomeProduto: string;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
  status: StatusItemPedido;
}

/**
 * "Fechar conta" SEM depender do back (o item 4 da V3 foi descartado).
 *
 * O back não tem status de Pedido nem rota /fechar. Então esta tela:
 *  1. soma os itens (não cancelados) dos pedidos da mesa, no próprio front;
 *  2. só deixa fechar quando todos os itens foram entregues;
 *  3. libera a mesa com o PATCH /mesas/{id}/desocupar, que já existe.
 *
 * Como o Pedido não tem status, o front não sabe quais pedidos da mesa já
 * foram pagos. Para isso, guarda no navegador a hora do último fechamento de
 * cada mesa (localStorage) e só soma os pedidos feitos depois dela. Se não
 * houver marca, soma apenas os pedidos de hoje.
 */
@Component({
  selector: 'app-fechar-conta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fechar-conta.html',
  styleUrl: './fechar-conta.css'
})
export class FecharContaComponent implements OnInit {

  mesas: MesaListagem[] = [];
  produtos: ProdutoListagem[] = [];

  mesaSelecionada: number | null = null;
  linhas: LinhaConta[] = [];

  carregandoMesas = false;
  carregandoConta = false;
  contaCompleta = false;
  confirmando = false;
  fechando = false;

  mensagemErro = '';
  mensagemSucesso = '';

  constructor(
    private mesaService: MesaService,
    private pedidoService: PedidoService,
    private itemPedidoService: ItemPedidoService,
    private produtoService: ProdutoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.produtoService.listarPorRestaurante().subscribe(produtos => (this.produtos = produtos));
    this.carregarMesas();
  }

  // Dados da tela 

  get mesasOcupadas(): MesaListagem[] {
    return this.mesas.filter(m => m.status === 'OCUPADA');
  }

  get mesaAtual(): MesaListagem | undefined {
    return this.mesas.find(m => m.id === this.mesaSelecionada);
  }

  get total(): number {
    return this.linhas.reduce((soma, linha) => soma + linha.subtotal, 0);
  }

  get itensNaoEntregues(): number {
    return this.linhas.filter(l => l.status !== 'ENTREGUE').length;
  }

  podeFechar(): boolean {
    return !!this.mesaSelecionada
      && !this.carregandoConta
      && this.contaCompleta
      && this.itensNaoEntregues === 0
      && !this.fechando;
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

  // Carregamento 

  carregarMesas(): void {
    this.carregandoMesas = true;
    this.mesaService.listarPorRestaurante().subscribe({
      next: mesas => {
        this.mesas = mesas;
        this.carregandoMesas = false;
      },
      error: () => {
        this.carregandoMesas = false;
        this.mensagemErro = 'Não foi possível carregar as mesas.';
      }
    });
  }

  aoSelecionarMesa(idMesa: number | null): void {
    this.mesaSelecionada = idMesa;
    this.confirmando = false;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    this.linhas = [];
    this.contaCompleta = false;

    if (idMesa) {
      this.carregarConta(idMesa);
    }
  }

  private carregarConta(idMesa: number): void {
    this.carregandoConta = true;

    this.pedidoService.listar(idMesa).subscribe({
      next: pedidos => {
        if (idMesa !== this.mesaSelecionada) return;

        const inicio = this.inicioDaConta(idMesa);
        const doPeriodo = pedidos.filter(p => p.dataHora >= inicio);

        if (doPeriodo.length === 0) {
          this.linhas = [];
          this.contaCompleta = true;
          this.carregandoConta = false;
          return;
        }

        const chamadas = doPeriodo.map(pedido =>
          this.itemPedidoService.listarPorPedido(pedido.id).pipe(
            map(itens => itens
              .filter(item => item.status !== 'CANCELADO')
              .map(item => ({
                idPedido: pedido.id,
                nomeProduto: this.produtos.find(p => p.id === item.idProduto)?.nome ?? `Produto #${item.idProduto}`,
                quantidade: item.quantidade,
                valorUnitario: item.valorUnitario,
                subtotal: item.quantidade * item.valorUnitario,
                status: item.status
              } as LinhaConta))),
            catchError(() => of(null))
          )
        );

        forkJoin(chamadas).subscribe(listas => {
          if (idMesa !== this.mesaSelecionada) return;

          this.carregandoConta = false;

          // Se algum pedido falhou ao carregar, o total estaria errado: não deixa fechar.
          if (listas.some(l => l === null)) {
            this.contaCompleta = false;
            this.mensagemErro = 'Não foi possível carregar todos os itens da conta. Tente novamente.';
            return;
          }

          this.linhas = (listas as LinhaConta[][]).flat();
          this.contaCompleta = true;
        });
      },
      error: () => {
        if (idMesa !== this.mesaSelecionada) return;
        this.carregandoConta = false;
        this.mensagemErro = 'Não foi possível carregar a conta da mesa.';
      }
    });
  }

  // Fechar conta 

  pedirConfirmacao(): void {
    if (!this.podeFechar()) return;
    this.confirmando = true;
  }

  cancelarConfirmacao(): void {
    this.confirmando = false;
  }

  confirmarFechamento(): void {
    if (!this.podeFechar() || !this.mesaSelecionada) return;

    const idMesa = this.mesaSelecionada;
    const numero = this.mesaAtual?.numero ?? idMesa;

    this.fechando = true;
    this.mensagemErro = '';

    this.mesaService.desocuparMesa(idMesa).subscribe({
      next: () => {
        this.registrarFechamento(idMesa);
        this.fechando = false;
        this.confirmando = false;
        this.mesaSelecionada = null;
        this.linhas = [];
        this.contaCompleta = false;
        this.mensagemSucesso = `Conta da Mesa ${numero} fechada. Mesa liberada.`;
        this.carregarMesas();
      },
      error: (erro) => {
        this.fechando = false;
        this.confirmando = false;
        this.mensagemErro = erro.status === 403
          ? 'Você não tem permissão para fechar esta conta.'
          : 'Não foi possível fechar a conta. Tente novamente.';
      }
    });
  }

  // Marca do último fechamento 

  /** Data/hora local no mesmo formato do back (sem fuso), para comparar texto com texto. */
  private formatarLocal(data: Date): string {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${data.getFullYear()}-${p(data.getMonth() + 1)}-${p(data.getDate())}`
      + `T${p(data.getHours())}:${p(data.getMinutes())}:${p(data.getSeconds())}`;
  }

  private chaveFechamento(idMesa: number): string {
    return `athenas:fechamento:${this.authService.getRestauranteId()}:${idMesa}`;
  }

  private inicioDaConta(idMesa: number): string {
    const inicioDeHoje = this.formatarLocal(new Date()).slice(0, 10) + 'T00:00:00';
    try {
      const marca = localStorage.getItem(this.chaveFechamento(idMesa));
      if (marca && marca > inicioDeHoje) return marca;
    } catch {
      // localStorage indisponível: usa só os pedidos de hoje
    }
    return inicioDeHoje;
  }

  private registrarFechamento(idMesa: number): void {
    try {
      localStorage.setItem(this.chaveFechamento(idMesa), this.formatarLocal(new Date()));
    } catch {
      // sem localStorage, o próximo cálculo volta a considerar os pedidos de hoje
    }
  }
}