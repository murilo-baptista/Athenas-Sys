import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Page } from '../models/pagina.model';
import {
  DadosAtualizacaoItemPedido,
  ItemPedidoDetalhamento,
  ItemPedidoListagem
} from '../models/item-pedido.model';
import { DadosCadastroItemPedido } from '../models/pedido.model';

/**
 * Endpoints: ver ItemPedidoController.java
 * (restaurantes/{idRestaurante}/pedidos/{idPedido}/itens)
 */
@Injectable({ providedIn: 'root' })
export class ItemPedidoService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get restauranteId(): number {
    return this.auth.getRestauranteId()!;
  }

  private itensUrl(pedidoId: number): string {
    return `${this.baseUrl}/${this.restauranteId}/pedidos/${pedidoId}/itens`;
  }

  listarPorPedido(pedidoId: number): Observable<ItemPedidoListagem[]> {
    return this.http
      .get<Page<ItemPedidoListagem>>(this.itensUrl(pedidoId))
      .pipe(map(pagina => pagina.content));
  }

  adicionarItem(pedidoId: number, dados: DadosCadastroItemPedido): Observable<ItemPedidoDetalhamento> {
    return this.http.post<ItemPedidoDetalhamento>(this.itensUrl(pedidoId), dados);
  }

  atualizar(pedidoId: number, itemId: number, dados: DadosAtualizacaoItemPedido): Observable<ItemPedidoDetalhamento> {
    return this.http.put<ItemPedidoDetalhamento>(`${this.itensUrl(pedidoId)}/${itemId}`, dados);
  }

  /** PENDENTE -> EM_PREPARO (usado pela cozinha) */
  preparar(pedidoId: number, itemId: number): Observable<ItemPedidoDetalhamento> {
    return this.http.patch<ItemPedidoDetalhamento>(`${this.itensUrl(pedidoId)}/${itemId}/preparar`, {});
  }

  /** EM_PREPARO -> PRONTO (usado pela cozinha) */
  marcarPronto(pedidoId: number, itemId: number): Observable<ItemPedidoDetalhamento> {
    return this.http.patch<ItemPedidoDetalhamento>(`${this.itensUrl(pedidoId)}/${itemId}/marcarPronto`, {});
  }

  /** PRONTO -> ENTREGUE (usado pelo garçom) */
  entregar(pedidoId: number, itemId: number): Observable<ItemPedidoDetalhamento> {
    return this.http.patch<ItemPedidoDetalhamento>(`${this.itensUrl(pedidoId)}/${itemId}/entregar`, {});
  }

  cancelar(pedidoId: number, itemId: number): Observable<ItemPedidoDetalhamento> {
    return this.http.patch<ItemPedidoDetalhamento>(`${this.itensUrl(pedidoId)}/${itemId}/cancelar`, {});
  }
}