import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MesaService } from '../../core/services/mesa.service';
import { AuthService } from '../../core/services/auth.service';
import { Mesa } from '../../core/models/mesa.model';

@Component({
  selector: 'app-cadastro-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-mesas.html',
  styleUrl: './cadastro-mesas.css'
})
export class CadastroMesasComponent implements OnInit {

  numeroMesa = '';
  capacidadeMesa: number | null = null;

  mesas: Mesa[] = [];

  carregando = false;
  salvando = false;
  mensagemErro = '';

  private restauranteId!: number;

  constructor(
    private router: Router,
    private mesaService: MesaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.authService.getRestauranteId();
    if (!id) {
      this.router.navigate(['/cadastro-restaurante']);
      return;
    }
    this.restauranteId = id;
    this.carregarMesas();
  }

  private carregarMesas(): void {
    this.carregando = true;
    this.mesaService.listarPorRestaurante(this.restauranteId).subscribe({
      next: (mesas) => {
        this.mesas = mesas;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar as mesas já cadastradas.';
      }
    });
  }

  adicionarMesa(): void {
    this.mensagemErro = '';

    if (!this.numeroMesa || !this.capacidadeMesa) {
      return;
    }

    this.salvando = true;

    this.mesaService.criar({
      numero: this.numeroMesa,
      capacidade: this.capacidadeMesa,
      restauranteId: this.restauranteId
    }).subscribe({
      next: (mesaCriada) => {
        this.mesas.push(mesaCriada);
        this.numeroMesa = '';
        this.capacidadeMesa = null;
        this.salvando = false;
      },
      error: () => {
        this.salvando = false;
        this.mensagemErro = 'Não foi possível adicionar essa mesa. Tente novamente.';
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/cadastro-restaurante']);
  }

  proximo(): void {
    if (this.mesas.length === 0) {
      this.mensagemErro = 'Cadastre pelo menos 1 mesa para continuar.';
      return;
    }

    this.router.navigate(['/cadastro-funcionarios']);
  }
}