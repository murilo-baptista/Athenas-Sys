import { Component, computed, inject } from '@angular/core';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { NotificacaoService } from './core/services/notificacao.service';
import { ativarOlhinhoSenha } from './core/utils/olhinho-senha';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // Template inline para carregar as rotas diretamente sem depender de arquivos HTML externos
  template: `
    <router-outlet></router-outlet>

    <!-- Moldura grega (zig-zag em cima e embaixo, pilar e panteão) das áreas do gerente e das reservas -->
    @if (comMoldura()) {
      <div class="moldura" aria-hidden="true">
        <div class="moldura-topo"></div>
        <img class="moldura-pilar" src="assets/imagens/pilar.png" alt="">
        <img class="moldura-panteon" src="assets/imagens/pantheon-pequeno.png" alt="">
        <div class="moldura-base"></div>
      </div>
    }

    <!-- Botão de voltar para a página anterior (todas as telas, menos o login) -->
    @if (mostrarVoltar()) {
      <button type="button" class="voltar-global" (click)="voltar()" aria-label="Voltar para a página anterior">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 5l-7 7 7 7"/>
        </svg>
        <span>Voltar</span>
      </button>
    }

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

    /* ---------- Botão voltar ---------- */
    .voltar-global {
      position: fixed;
      top: 10px;
      left: 12px;
      z-index: 900;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px 6px 10px;
      border: 2px solid #C9A46A;
      border-radius: 999px;
      background-color: #FFF8EE;
      color: #7B0F12;
      font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 3px 8px rgba(90, 11, 13, 0.22);
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .voltar-global:hover {
      background-color: #7B0F12;
      color: #FFF8EE;
    }

    /* ---------- Moldura grega ---------- */
    .moldura {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }
    .moldura-topo,
    .moldura-base {
      position: absolute;
      left: 0;
      right: 0;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='22' viewBox='0 0 40 22'><path d='M0 4 H14 V18 H24 V10 H34 V18 H40' fill='none' stroke='%23C9A46A' stroke-width='2.4'/></svg>");
      background-repeat: repeat-x;
      background-size: 40px 22px;
      background-position: left center;
    }
    .moldura-topo { top: 0; height: 54px; }
    .moldura-base { bottom: 0; height: 22px; }
    .moldura-pilar {
      position: absolute;
      right: 0;
      top: 54px;
      height: calc(100% - 76px);
      width: auto;
      opacity: 0.5;
    }
    .moldura-panteon {
      position: absolute;
      left: 24px;
      bottom: 0;
      width: 200px;
      height: auto;
      opacity: 0.9;
    }
    @media (max-width: 1000px) {
      .moldura-pilar { display: none; }
    }
  `]
})
export class App {
  title = 'athenas-sys-frontend';
  notificacao = inject(NotificacaoService);

  private router = inject(Router);
  private location = inject(Location);

  private rota = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects.split(/[?#]/)[0])
    ),
    { initialValue: this.router.url.split(/[?#]/)[0] }
  );

  /** Subpáginas do gerente e reservas: já têm o seu próprio link de voltar. */
  private temVoltarProprio = computed(() => {
    const r = this.rota();
    return r.startsWith('/gerente/') || r.startsWith('/recepcao/reservas');
  });

  comMoldura = computed(() => {
    const r = this.rota();
    return r === '/gerente' || this.temVoltarProprio();
  });

  mostrarVoltar = computed(() => {
    const r = this.rota();
    if (r === '' || r === '/' || r === '/login') return false;
    return !this.temVoltarProprio();
  });

  constructor() {
    ativarOlhinhoSenha();
  }

  voltar(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/menu']);
    }
  }
}