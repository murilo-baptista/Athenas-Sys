import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AtualizarPedidoRequest, CriarPedidoRequest, Pedido} from '../models/pedido.model';
import { Page } from '../models/pagina.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PedidoService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get restauranteId(): number {
    return this.auth.getRestauranteId()!;
  }

  listar(idMesa?: number, idFuncionario?: number): Observable<Pedido[]> {
    let params = new HttpParams();
    if (idMesa) {
      params = params.set('idMesa', idMesa);
    }
    if (idFuncionario) {
      params = params.set('idFuncionario', idFuncionario);
    } 
    return this.http.get<Page<Pedido>>(`${this.baseUrl}/${this.restauranteId}/pedidos`, { params }).pipe(map(r => r.content));
  }

  criar(dados: CriarPedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.baseUrl}/${this.restauranteId}/pedidos`, dados);
  }

  atualizar(pedidoId: number, dados: AtualizarPedidoRequest): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.baseUrl}/${this.restauranteId}/pedidos/${pedidoId}`, dados);
  }

  entregar(pedidoId: number): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.baseUrl}/${this.restauranteId}/pedidos/${pedidoId}/entregar`, {});
  }

  cancelar(pedidoId: number): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.baseUrl}/${this.restauranteId}/pedidos/${pedidoId}/cancelar`, {});
  }
}