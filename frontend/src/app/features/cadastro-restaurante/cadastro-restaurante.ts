import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface CadastroRestauranteForm {
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  senha: string;
  confirmarSenha: string;
}

@Component({
  selector: 'app-cadastro-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-restaurante.html',
  styleUrl: './cadastro-restaurante.css'
})
export class CadastroRestauranteComponent {

  form: CadastroRestauranteForm = {
    nome: '',
    email: '',
    telefone: '',
    cnpj: '',
    senha: '',
    confirmarSenha: ''
  };

  constructor(private router: Router) {}

  voltarLogin(): void {
    this.router.navigate(['/login']);
  }

  proximo(): void {
    if (!this.form.nome || !this.form.email || !this.form.senha) {
      return;
    }

    if (this.form.senha !== this.form.confirmarSenha) {
      // TODO: exibir mensagem de erro de confirmação de senha
      return;
    }

    // TODO: persistir os dados do restaurante (service/API) antes de avançar
    this.router.navigate(['/cadastro-mesas']);
  }
}