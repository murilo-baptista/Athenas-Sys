import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AtualizarStatusPedidoRequest, CriarPedidoRequest, Pedido, StatusPedido } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {

  private readonly baseUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  listar(restauranteId: number, status?: StatusPedido): Observable<Pedido[]> {
    let params = new HttpParams().set('restauranteId', restauranteId);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Pedido[]>(this.baseUrl, { params });
  }

  criar(dados: CriarPedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseUrl, dados);
  }

  atualizarStatus(pedidoId: number, status: StatusPedido): Observable<Pedido> {
    const body: AtualizarStatusPedidoRequest = { status };
    return this.http.patch<Pedido>(`${this.baseUrl}/${pedidoId}/status`, body);
  }
}