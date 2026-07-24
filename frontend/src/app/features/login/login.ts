import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  onSubmit(): void {
    if (!this.usuario || !this.senha) {
      return;
    }

    // TODO: substituir pela chamada real ao backend (Spring Boot)
    console.log('Login solicitado:', {
      usuario: this.usuario,
      lembrarMe: this.lembrarMe
    });
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/recuperar-senha']);
  }

  onRegister(): void {
    this.router.navigate(['/cadastro']);
  }
}