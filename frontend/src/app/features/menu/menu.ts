import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent {

  constructor(private router: Router) {}

  onSelectArea(area: string): void {
    switch (area) {
      case 'gerente':
        this.router.navigate(['/gerente']);
        break;
      case 'recepcionista':
        this.router.navigate(['/recepcao']);
        break;
      case 'garcom':
        this.router.navigate(['/garcom']);
        break;
      case 'cozinha':
        this.router.navigate(['/cozinha']);
        break;
      case 'estoque':
        // TODO: criar a rota/tela de estoque (funcionalidade futura)
        console.log('Área de estoque ainda não implementada');
        break;
    }
  }
}