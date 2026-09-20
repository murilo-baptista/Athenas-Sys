import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RestauranteService } from '../../../core/services/restaurante.service';
import { AuthService } from '../../../core/services/auth.service';
import { Restaurante } from '../../../core/models/restaurante.model';

interface FormularioRestaurante {
  nome: string;
  email: string;
  telefone: string;
}

@Component({
  selector: 'app-config-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './config-restaurante.html'
})
export class ConfigRestauranteComponent implements OnInit {

  restaurante: Restaurante | null = null;
  carregando = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  form: FormularioRestaurante = { nome: '', email: '', telefone: '' };

  constructor(
    private restauranteService: RestauranteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    const restauranteId = this.authService.getRestauranteId();
    if (!restauranteId) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregando = true;
    this.restauranteService.buscarPorId(restauranteId).subscribe({
      next: (restaurante) => {
        this.restaurante = restaurante;
        this.form = {
          nome: restaurante.nome,
          email: restaurante.email,
          telefone: restaurante.telefone
        };
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar os dados do restaurante.';
      }
    });
  }

  salvar(): void {
    if (!this.restaurante?.id) return;
    if (!this.form.nome.trim() || !this.form.email.trim() || !this.form.telefone.trim()) {
      this.mensagemErro = 'Preencha nome, e-mail e telefone.';
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.restauranteService.atualizar(this.restaurante.id, {
      nome: this.form.nome.trim(),
      email: this.form.email.trim(),
      telefone: this.form.telefone.trim()
    }).subscribe({
      next: (atualizado) => {
        this.restaurante = atualizado;
        this.salvando = false;
        this.mensagemSucesso = 'Dados atualizados com sucesso.';
      },
      error: () => {
        this.salvando = false;
        this.mensagemErro = 'Não foi possível salvar os dados do restaurante.';
      }
    });
  }

  desativarConta(): void {
    if (!this.restaurante?.id) return;

    const confirmacao = confirm(
      `Tem certeza que deseja desativar o restaurante "${this.restaurante.nome}"? Esta ação não pode ser desfeita por aqui.`
    );
    if (!confirmacao) return;

    this.restauranteService.remover(this.restaurante.id).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: () => (this.mensagemErro = 'Não foi possível desativar o restaurante.')
    });
  }
}