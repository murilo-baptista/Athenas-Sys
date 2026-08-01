import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-autenticacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autenticacao.html',
  styleUrl: './autenticacao.css'
})
export class AutenticacaoComponent {

  usuario: string = '';
  senha: string = '';
  lembrarMe: boolean = false;

  constructor(private router: Router) {}

  onEntrar(): void {
    // TODO: validar usuário/senha com o backend
    console.log('Login:', this.usuario, this.senha, this.lembrarMe);
  }
}