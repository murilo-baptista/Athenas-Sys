import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MesaService } from '../../../core/services/mesa.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { ItemPedidoService } from '../../../core/services/item-pedido.service';
import { ProdutoService } from '../../../core/services/produto.service';

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
 * "Conta da mesa" (somente leitura) para o garçom.
 *
 * O item 4 da V3 (status do Pedido e fechar conta) foi descartado no back, e
 * liberar a mesa (PATCH /mesas/{id}/desocupar) é permitido só para GERENTE e
 * RECEPCAO (ver SecurityConfig.java). Por isso esta tela NÃO libera a mesa: a
 * recepção continua fazendo isso pelo mapa de mesas.
 *
 * O que ela faz: soma, no próprio front, os itens (não cancelados) dos pedidos
 * feitos hoje para a mesa escolhida. Só usa rotas que o GARCOM já pode chamar
 * (GET mesas, GET pedidos, GET itens, GET produtos).
 *
 * Limitação: o Pedido não tem status, então o front não sabe quais pedidos
 * da mesa já foram pagos por clientes anteriores. Por isso a conta considera
 * apenas os pedidos de hoje.
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

  mensagemErro = '';

  constructor(
    private mesaService: MesaService,
    private pedidoService: PedidoService,
    private itemPedidoService: ItemPedidoService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.produtoService.listarPorRestaurante().subscribe(produtos => (this.produtos = produtos));
    this.carregarMesas();
  }

  // ===================== Dados da tela =====================

  get mesasOcupadas(): MesaListagem[] {
    return this.mesas.filter(m => m.status === 'OCUPADA');
  }

  get total(): number {
    return this.linhas.reduce((soma, linha) => soma + linha.subtotal, 0);
  }

  get itensNaoEntregues(): number {
    return this.linhas.filter(l => l.status !== 'ENTREGUE').length;
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

  // ===================== Carregamento =====================

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
    this.mensagemErro = '';
    this.linhas = [];
    this.contaCompleta = false;

    if (idMesa) {
      this.carregarConta(idMesa);
    }
  }

  atualizar(): void {
    if (this.mesaSelecionada) {
      this.mensagemErro = '';
      this.carregarConta(this.mesaSelecionada);
    }
  }

  private carregarConta(idMesa: number): void {
    this.carregandoConta = true;

    this.pedidoService.listar(idMesa).subscribe({
      next: pedidos => {
        if (idMesa !== this.mesaSelecionada) return;

        const inicioDeHoje = this.inicioDeHoje();
        const doDia = pedidos.filter(p => p.dataHora >= inicioDeHoje);

        if (doDia.length === 0) {
          this.linhas = [];
          this.contaCompleta = true;
          this.carregandoConta = false;
          return;
        }

        const chamadas = doDia.map(pedido =>
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

          // Se algum pedido falhou ao carregar, o total estaria errado: não mostra.
          if (listas.some(l => l === null)) {
            this.contaCompleta = false;
            this.mensagemErro = 'Não foi possível carregar todos os itens da conta. Tente novamente.';
            return;
          }

          this.linhas = (listas as LinhaConta[][]).flat();
          this.contaCompleta = true;
        });
      },
      error: (erro) => {
        if (idMesa !== this.mesaSelecionada) return;
        this.carregandoConta = false;
        this.mensagemErro = erro.status === 403
          ? 'Você não tem permissão para ver esta conta.'
          : 'Não foi possível carregar a conta da mesa.';
      }
    });
  }

  /** Início do dia (hora local) no mesmo formato do back, para comparar texto com texto. */
  private inicioDeHoje(): string {
    const agora = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${agora.getFullYear()}-${p(agora.getMonth() + 1)}-${p(agora.getDate())}T00:00:00`;
  }
}