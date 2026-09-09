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

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(): void {
    this.mensagemErro = '';

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
        this.mensagemErro = erro.status === 401
          ? 'Usuário ou senha inválidos.'
          : 'Não foi possível entrar agora. Tente novamente em instantes.';
      }
    });
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/recuperar-senha']);
  }

  onRegister(): void {
    this.router.navigate(['/cadastro-restaurante']);
  }
}