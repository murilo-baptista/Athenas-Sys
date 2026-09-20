import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Page } from '../models/pagina.model';
import {
  DadosAtualizacaoPedido,
  DadosCadastroPedido,
  PedidoDetalhamento,
  PedidoListagem
} from '../models/pedido.model';

/**
 * Endpoints: ver PedidoController.java (restaurantes/{idRestaurante}/pedidos)
 * Só o GET com {idPedido} (detalhar) retorna os itens do pedido embutidos.
 * O GET de listagem (sem id) NÃO traz os itens.
 * Os métodos de status (entregar/cancelar) pertencem ao ItemPedido, não ao
 * Pedido — ver item-pedido.service.ts.
 */
@Injectable({ providedIn: 'root' })
export class PedidoService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get restauranteId(): number {
    return this.auth.getRestauranteId()!;
  }

  listar(idMesa?: number, idFuncionario?: number): Observable<PedidoListagem[]> {
    let params = new HttpParams();
    if (idMesa) {
      params = params.set('idMesa', idMesa);
    }
    if (idFuncionario) {
      params = params.set('idFuncionario', idFuncionario);
    }
    return this.http
      .get<Page<PedidoListagem>>(`${this.baseUrl}/${this.restauranteId}/pedidos`, { params })
      .pipe(map(pagina => pagina.content));
  }

  detalhar(pedidoId: number): Observable<PedidoDetalhamento> {
    return this.http.get<PedidoDetalhamento>(`${this.baseUrl}/${this.restauranteId}/pedidos/${pedidoId}`);
  }

  criar(dados: DadosCadastroPedido): Observable<PedidoDetalhamento> {
    return this.http.post<PedidoDetalhamento>(`${this.baseUrl}/${this.restauranteId}/pedidos`, dados);
  }

  atualizar(pedidoId: number, dados: DadosAtualizacaoPedido): Observable<PedidoDetalhamento> {
    return this.http.put<PedidoDetalhamento>(`${this.baseUrl}/${this.restauranteId}/pedidos/${pedidoId}`, dados);
  }
}