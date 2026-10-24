import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Cabecalho } from './layout/cabecalho/cabecalho';
import { Rodape } from './layout/rodape/rodape';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cabecalho, Rodape],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  constructor() {
    // Ao trocar de página, volta para o topo
    this.router.events
      .pipe(filter(evento => evento instanceof NavigationEnd))
      .subscribe(() => window.scrollTo({ top: 0 }));
  }
}