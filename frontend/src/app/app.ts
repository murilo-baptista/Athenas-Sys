import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificacaoService } from './core/services/notificacao.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // Template inline para carregar as rotas diretamente sem depender de arquivos HTML externos
  template: `
    <router-outlet></router-outlet>

    @if (notificacao.mensagem(); as texto) {
      <div class="aviso-global" role="alert">
        <span>{{ texto }}</span>
        <button type="button" class="aviso-global-fechar" aria-label="Fechar aviso" (click)="notificacao.fechar()">&times;</button>
      </div>
    }
  `,
  styles: [`
    .aviso-global {
      position: fixed;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      max-width: 90vw;
      padding: 0.75rem 1rem;
      border: 1px solid #F5C2C0;
      border-radius: 0.5rem;
      background-color: #FDECEA;
      color: #7B0F12;
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 0.9375rem;
      box-shadow: 0 6px 20px rgba(90, 11, 13, 0.2);
    }
    .aviso-global-fechar {
      border: 0;
      background: none;
      color: inherit;
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
    }
  `]
})
export class App {
  title = 'athenas-sys-frontend';
  notificacao = inject(NotificacaoService);
}