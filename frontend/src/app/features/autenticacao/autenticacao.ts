import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BannerAthenasComponent } from '../../shared/components/banner-athenas/banner-athenas';

@Component({
  selector: 'app-autenticacao',
  standalone: true,
  imports: [CommonModule, FormsModule, BannerAthenasComponent],
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
      codigo: this.senha
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
        if (erro.status === 401) {
          this.mensagemErro = 'Usuário ou código inválidos.';
        } else if (erro.status === 429) {
          this.mensagemErro = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
        } else {
          this.mensagemErro = 'Não foi possível autenticar agora. Tente novamente.';
        }
      }
    });
  }

  onEsqueciCodigo(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/recuperar-codigo']);
  }
}