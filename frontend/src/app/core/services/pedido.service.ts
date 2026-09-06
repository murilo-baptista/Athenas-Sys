import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AtualizarStatusPedidoRequest, CriarPedidoRequest, Pedido, StatusPedido } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient) {}

  listar(restauranteId: number, idMesa?: number, idFuncionario?: number): Observable<Pedido[]> {
    let params = new HttpParams();
    if (idMesa) {
      params = params.set('idMesa', idMesa);
    }
    if (idFuncionario) {
      params = params.set('idFuncionario', idFuncionario);
    }
    return this.http.get<Pedido[]>(`${this.baseUrl}/${restauranteId}/pedidos`, { params });
  }

  criar(restauranteId: number, dados: CriarPedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.baseUrl}/${restauranteId}/pedidos`, dados);
  }

  atualizar(restauranteId: number, pedidoId: number, dados: AtualizarPedidoRequest): Observable<Pedido> {
      return this.http.put<Pedido>(`${this.baseUrl}/${restauranteId}/pedidos/${pedidoId}`, dados);
    }

  marcarPronto(restauranteId: number, pedidoId: number): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.baseUrl}/${restauranteId}/pedidos/${pedidoId}/marcarPronto`, {});
  }

  entregar(restauranteId: number, pedidoId: number): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.baseUrl}/${restauranteId}/pedidos/${pedidoId}/entregar`, {});
  }
}