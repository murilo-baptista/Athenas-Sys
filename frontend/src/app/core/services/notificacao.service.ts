import { Injectable, signal } from '@angular/core';

/** Aviso global de erro (ex.: 403 sem permissão), exibido pelo componente raiz. */
@Injectable({ providedIn: 'root' })
export class NotificacaoService {

  readonly mensagem = signal<string | null>(null);

  private temporizador?: ReturnType<typeof setTimeout>;

  erro(texto: string, duracaoMs = 5000): void {
    this.mensagem.set(texto);
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.fechar(), duracaoMs);
  }

  fechar(): void {
    clearTimeout(this.temporizador);
    this.mensagem.set(null);
  }
}