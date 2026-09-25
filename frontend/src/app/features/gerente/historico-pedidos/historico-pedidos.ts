import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import { MesaService } from '../../../core/services/mesa.service';
import { FuncionarioService } from '../../../core/services/funcionario.service';
import { PedidoListagem } from '../../../core/models/pedido.model';
import { MesaListagem } from '../../../core/models/mesa.model';
import { Funcionario } from '../../../core/models/funcionario.model';

@Component({
  selector: 'app-historico-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './historico-pedidos.html'
})
export class HistoricoPedidosComponent implements OnInit {

  pedidos: PedidoListagem[] = [];
  mesas: MesaListagem[] = [];
  funcionarios: Funcionario[] = [];

  carregando = false;
  mensagemErro = '';

  filtroMesa: number | 'todas' = 'todas';
  filtroFuncionario: number | 'todos' = 'todos';
  filtroDataInicio = '';
  filtroDataFim = '';

  constructor(
    private pedidoService: PedidoService,
    private mesaService: MesaService,
    private funcionarioService: FuncionarioService
  ) {}

  ngOnInit(): void {
    this.mesaService.listarPorRestaurante().subscribe(mesas => (this.mesas = mesas));
    this.funcionarioService.listarPorRestaurante().subscribe(funcionarios => (this.funcionarios = funcionarios));
    this.buscar();
  }

  buscar(): void {
    this.carregando = true;
    this.mensagemErro = '';

    const idMesa = this.filtroMesa !== 'todas' ? this.filtroMesa : undefined;
    const idFuncionario = this.filtroFuncionario !== 'todos' ? this.filtroFuncionario : undefined;

    this.pedidoService.listar(idMesa, idFuncionario).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar o histórico de pedidos.';
      }
    });
  }

  pedidosFiltrados(): PedidoListagem[] {
    // Filtro de data é feito aqui porque o backend não expõe esse filtro
    // na listagem (só idMesa e idFuncionario — ver PedidoController.java).
    return this.pedidos.filter(pedido => {
      const dataPedido = pedido.dataHora.slice(0, 10);

      if (this.filtroDataInicio && dataPedido < this.filtroDataInicio) return false;
      if (this.filtroDataFim && dataPedido > this.filtroDataFim) return false;

      return true;
    });
  }

  numeroMesa(idMesa: number): number | string {
    return this.mesas.find(m => m.id === idMesa)?.numero ?? idMesa;
  }

  nomeFuncionario(idFuncionario: number): string {
    return this.funcionarios.find(f => f.id === idFuncionario)?.nome ?? `Funcionário #${idFuncionario}`;
  }
}