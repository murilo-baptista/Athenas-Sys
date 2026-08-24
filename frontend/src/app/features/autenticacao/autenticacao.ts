import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-autenticacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autenticacao.html',
  styleUrl: './autenticacao.css'
})
export class AutenticacaoComponent implements OnInit {

  usuario = '';
  senha = '';
  lembrarMe = false;

  carregando = false;
  mensagemErro = '';

  /** Cargo esperado e rota de destino, recebidos da tela de menu (/menu). */
  cargoEsperado = '';
  private destino = '/login';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.cargoEsperado = params.get('cargo') ?? '';
      this.destino = params.get('destino') ?? '/login';
    });

    const restauranteId = this.authService.getRestauranteId();
    if (!restauranteId) {
      // Sem restaurante logado não há como autenticar um funcionário.
      this.router.navigate(['/login']);
    }
  }

  onEntrar(): void {
    this.mensagemErro = '';

    const restauranteId = this.authService.getRestauranteId();
    if (!restauranteId) {
      this.mensagemErro = 'Sessão do restaurante expirada. Faça login novamente.';
      return;
    }

    if (!this.usuario || !this.senha) {
      this.mensagemErro = 'Informe usuário e código de acesso.';
      return;
    }

    this.carregando = true;

    this.authService.loginFuncionario({
      usuario: this.usuario,
      codigo: this.senha,
      restauranteId
    }).subscribe({
      next: (resposta) => {
        this.carregando = false;

        if (this.cargoEsperado && resposta.cargo !== this.cargoEsperado) {
          this.mensagemErro = `Este código pertence ao cargo "${resposta.cargo}", não a "${this.cargoEsperado}".`;
          this.authService.logout();
          return;
        }

        this.router.navigate([this.destino]);
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = erro.status === 401
          ? 'Usuário ou código inválidos.'
          : 'Não foi possível autenticar agora. Tente novamente.';
      }
    });
  }
}