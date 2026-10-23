import { Component } from '@angular/core';

/**
 * Banner bordô da lateral esquerda (logo + nome + frase + deusa).
 * Usado em login, autenticação, menu e nas três telas de cadastro, para que
 * todas fiquem idênticas.
 *
 * Imagem da logo: assets/imagens/logo-transparente.png
 */
@Component({
  selector: 'app-banner-athenas',
  standalone: true,
  template: `
    <img src="assets/imagens/banner-bordo.jpeg" alt="Athenas - Gestão inteligente para restaurantes" class="banner-img">
    <div class="banner-content">
      <img src="assets/imagens/logo-transparente.png" alt="Athenas Sys" class="banner-logo">
      <div class="banner-texto">
        <h2 class="banner-title">Athenas</h2>
        <span class="banner-sys">Sys</span>
        <p class="banner-subtitle">Gestão inteligente<br>para restaurantes</p>
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
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2.5vh 20px 0;
    }

    .banner-logo {
      height: clamp(96px, 17vh, 200px);
      width: auto;
      aspect-ratio: 1 / 1;
      object-fit: contain;
      flex-shrink: 0;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
    }

    /* Nome + "Sys" + frase ficam ACIMA do divisor dourado da imagem,
       sem encostar na deusa que aparece logo abaixo dele. */
    .banner-texto {
      position: absolute;
      left: 0;
      right: 0;
      top: calc(var(--posicao-divisor) - 10px);
      transform: translateY(-100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 16px;
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