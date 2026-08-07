import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Mesa {
  numero: string;
  capacidade: number;
}

@Component({
  selector: 'app-cadastro-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-mesas.html',
  styleUrl: './cadastro-mesas.css'
})
export class CadastroMesasComponent {

  numeroMesa = '';
  capacidadeMesa: number | null = null;

  mesas: Mesa[] = [
    { numero: '01', capacidade: 4 },
    { numero: '02', capacidade: 2 },
    { numero: '03', capacidade: 6 }
  ];

  constructor(private router: Router) {}

  adicionarMesa(): void {
    if (!this.numeroMesa || !this.capacidadeMesa) {
      return;
    }

    this.mesas.push({
      numero: this.numeroMesa,
      capacidade: this.capacidadeMesa
    });

    this.numeroMesa = '';
    this.capacidadeMesa = null;
  }

  voltar(): void {
    this.router.navigate(['/cadastro-restaurante']);
  }

  proximo(): void {
    if (this.mesas.length === 0) {
      return;
    }

    // TODO: persistir as mesas cadastradas (service/API) antes de avançar
    this.router.navigate(['/cadastro-funcionarios']);
  }
}