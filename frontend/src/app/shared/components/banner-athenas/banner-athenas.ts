import { Component } from '@angular/core';

/**
 * Banner bordô da lateral esquerda (logo + nome + frase + deusa).
 * Usado em login, autenticação, menu e nas três telas de cadastro, para que
 * todas fiquem idênticas.
 *
 * Imagem da logo: assets/imagens/logo-simples-dourada.png
 */
@Component({
  selector: 'app-banner-athenas',
  standalone: true,
  template: `
    <img src="assets/imagens/banner-bordo.jpeg" alt="Athenas - Gestão inteligente para restaurantes" class="banner-img">
    <div class="banner-content">
      <!-- Parte de cima do banner, até o divisor dourado da imagem -->
      <div class="banner-topo">
        <img src="assets/imagens/logo-simples-dourada.png" alt="Athenas Sys" class="banner-logo">
        <div class="banner-texto">
          <h2 class="banner-title">Athenas</h2>
          <span class="banner-sys">Sys</span>
          <p class="banner-subtitle">Gestão inteligente<br>para restaurantes</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --cor-dourado: #C9A46A;
      --posicao-divisor: 37%;   /* altura do divisor dourado dentro da imagem do banner */
      display: block;
      position: relative;
      width: 314px;
      height: 100%;
      flex-shrink: 0;
      overflow: hidden;
      background-color: #7B0F12;
    }

    .banner-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .banner-content {
      position: absolute;
      inset: 0;
    }

    /* Vai do topo do banner até o divisor dourado da imagem. */
    .banner-topo {
      height: var(--posicao-divisor);
      box-sizing: border-box;
      padding-top: 2.5vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .banner-logo {
      height: clamp(96px, 17vh, 200px);
      width: auto;
      aspect-ratio: 1 / 1;
      object-fit: contain;
      flex-shrink: 0;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
    }

    /* Nome + "Sys" + frase ficam EXATAMENTE no meio do espaço entre a
       logo e o divisor dourado, e nunca encostam na deusa. */
    .banner-texto {
      flex: 1;
      min-height: 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
      box-sizing: border-box;
    }

    .banner-title {
      color: var(--cor-dourado);
      font-size: clamp(22px, 3.2vh, 34px);
      letter-spacing: 5px;
      padding-left: 5px;
      font-family: 'Times New Roman', serif;
      text-transform: uppercase;
      line-height: 1;
      margin: 0;
    }

    .banner-sys {
      color: var(--cor-dourado);
      font-size: clamp(12px, 1.7vh, 17px);
      letter-spacing: 7px;
      padding-left: 7px;
      font-family: 'Times New Roman', serif;
      text-transform: uppercase;
      line-height: 1;
      margin: 5px 0 9px;
    }

    .banner-subtitle {
      color: var(--cor-dourado);
      font-size: clamp(10px, 1.4vh, 14px);
      letter-spacing: 1px;
      text-transform: uppercase;
      font-family: 'Georgia', serif;
      opacity: 0.9;
      margin: 0;
    }
  `]
})
export class BannerAthenasComponent {}