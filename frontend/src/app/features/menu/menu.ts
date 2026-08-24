import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface AreaConfig {
  cargo: string;
  destino: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent {

  private readonly areas: Record<string, AreaConfig> = {
    gerente: { cargo: 'Gerente', destino: '/gerente' },
    recepcionista: { cargo: 'Recepção', destino: '/recepcao' },
    garcom: { cargo: 'Garçom', destino: '/garcom' },
    cozinha: { cargo: 'Cozinha', destino: '/cozinha' }
  };

  constructor(private router: Router) {}

  onSelectArea(area: string): void {
    const config = this.areas[area];

    if (!config) {
      // Área ainda não implementada no back-end (ex: estoque).
      console.log(`Área "${area}" ainda não implementada.`);
      return;
    }

    // Encaminha para a tela de autenticação do funcionário, informando
    // qual cargo/tela ele deve acessar após confirmar usuário e código.
    this.router.navigate(['/autenticacao'], {
      queryParams: { cargo: config.cargo, destino: config.destino }
    });
  }
}