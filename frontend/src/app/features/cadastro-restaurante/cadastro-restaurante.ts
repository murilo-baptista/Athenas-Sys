import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestauranteService } from '../../core/services/restaurante.service';
import { AuthService } from '../../core/services/auth.service';
import { BannerAthenasComponent } from '../../shared/components/banner-athenas/banner-athenas';
import { mensagemDeErro } from '../../core/utils/mensagem-erro';

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
  imports: [CommonModule, FormsModule, BannerAthenasComponent],
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

  /** true quando o cadastro foi recusado por e-mail/CNPJ que já existe: oferece reativar. */
  oferecerReativar = false;

  constructor(
    private router: Router,
    private restauranteService: RestauranteService,
    private authService: AuthService
  ) {}

  voltarLogin(): void {
    this.router.navigate(['/login']);
  }

  irParaReativar(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/reativar-restaurante']);
  }

  proximo(): void {
    this.mensagemErro = '';
    this.oferecerReativar = false;

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
      next: (resposta) => {
        this.carregando = false;
        // O back-end já devolve um token junto com o restaurante recém-criado.
        // Guardamos ele na sessão para que as próximas etapas do wizard
        // (cadastro de mesas e de funcionários) já enviem o Authorization.
        this.authService.iniciarSessaoAposCadastro(
          resposta.token,
          resposta.restaurante.id!,
          resposta.restaurante.nome
        );
        this.router.navigate(['/cadastro-mesas']);
      },
      error: (erro) => {
        this.carregando = false;

        if (erro.status === 409) {
          // 409 com codigo = ENTIDADE_DESATIVADA: o back avisa que o restaurante existe, mas está desativado.
          // 409 em lista: e-mail/CNPJ duplicado. Como o back ainda não diz se o dono
          // está desativado, oferecemos o link de reativar nos dois casos.
          this.oferecerReativar = true;
          this.mensagemErro = erro.error?.codigo === 'ENTIDADE_DESATIVADA'
            ? (erro.error?.mensagem || 'Já existe um restaurante com esse e-mail, mas ele está desativado.')
            : mensagemDeErro(erro, 'Já existe um restaurante cadastrado com esse e-mail.');
        } else {
          this.mensagemErro = mensagemDeErro(erro, 'Não foi possível concluir o cadastro. Tente novamente.');
        }
      }
    });
  }
}