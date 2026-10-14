import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  usuario = '';
  senha = '';
  lembrarMe = false;

  carregando = false;
  mensagemErro = '';
  contaDesativada = false;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(): void {
    this.mensagemErro = '';
    this.contaDesativada = false;

    if (!this.usuario || !this.senha) {
      this.mensagemErro = 'Preencha usuário e senha para continuar.';
      return;
    }

    this.carregando = true;

    this.authService.loginRestaurante({ usuario: this.usuario, senha: this.senha }).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/menu']);
      },
      error: (erro) => {
        this.carregando = false;

        if (erro.status === 401) {
          this.mensagemErro = 'Usuário ou senha inválidos.';
        } else if (erro.status === 403) {
          // Pelo PDF da V3, no login o 403 significa "conta desativada"
          const mensagem = typeof erro.error === 'string' ? erro.error : erro.error?.mensagem;
          this.mensagemErro = mensagem || 'Esta conta está desativada.';
          this.contaDesativada = true;
        } else {
          this.mensagemErro = 'Não foi possível entrar agora. Tente novamente em instantes.';
        }
      }
    });
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/recuperar-senha']);
  }

  onReativar(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/reativar-restaurante']);
  }

  onRegister(): void {
    this.router.navigate(['/cadastro-restaurante']);
  }
}