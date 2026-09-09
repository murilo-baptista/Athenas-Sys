import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestauranteService } from '../../core/services/restaurante.service';
import { AuthService } from '../../core/services/auth.service';

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

  carregando = false;
  mensagemErro = '';

  constructor(
    private router: Router,
    private restauranteService: RestauranteService,
    private authService: AuthService
  ) {}

  voltarLogin(): void {
    this.router.navigate(['/login']);
  }

  proximo(): void {
    this.mensagemErro = '';

    if (!this.form.nome || !this.form.email || !this.form.senha) {
      this.mensagemErro = 'Preencha nome, e-mail e senha para continuar.';
      return;
    }

    if (this.form.senha !== this.form.confirmarSenha) {
      this.mensagemErro = 'As senhas não conferem.';
      return;
    }

    this.carregando = true;

    this.restauranteService.cadastrar({
      nome: this.form.nome,
      email: this.form.email,
      telefone: this.form.telefone,
      cnpj: this.form.cnpj,
      senha: this.form.senha
    }).subscribe({
      next: (restaurante) => {
        this.carregando = false;
        // Guarda o id do restaurante recém-criado para usar nas próximas
        // etapas do wizard (cadastro de mesas e de funcionários).
        this.authService.definirRestauranteIdTemporario(restaurante.id!, restaurante.nome);
        this.router.navigate(['/cadastro-mesas']);
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = erro.status === 409
          ? 'Já existe um restaurante cadastrado com esse e-mail.'
          : 'Não foi possível concluir o cadastro. Tente novamente.';
      }
    });
  }
}