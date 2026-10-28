import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecuperacaoService } from '../../core/services/recuperacao.service';
import { mensagemDeErro } from '../../core/utils/mensagem-erro';

type Etapa = 'EMAIL' | 'CODIGO';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.css'
})
export class RecuperarSenhaComponent {

  etapa: Etapa = 'EMAIL';
  carregando = false;
  mensagemErro = '';
  mensagemInfo = '';

  email = '';
  codigo = '';
  novaSenha = '';
  confirmacaoSenha = '';

  constructor(
    private recuperacaoService: RecuperacaoService,
    private router: Router
  ) {}

  solicitarCodigo(): void {
    this.mensagemErro = '';
    this.mensagemInfo = '';

    if (!this.email.trim()) {
      this.mensagemErro = 'Informe o e-mail do restaurante.';
      return;
    }

    this.carregando = true;
    this.recuperacaoService.solicitarCodigo({ email: this.email.trim() }).subscribe({
      next: () => {
        this.carregando = false;
        this.mensagemInfo = 'Se o e-mail estiver cadastrado, enviamos um código.';
        this.etapa = 'CODIGO';
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível enviar o código agora. Tente novamente em instantes.');
      }
    });
  }

  confirmarCodigo(): void {
    this.mensagemErro = '';

    if (!this.codigo.trim() || !this.novaSenha || !this.confirmacaoSenha) {
      this.mensagemErro = 'Preencha o código e a nova senha.';
      return;
    }
    if (this.novaSenha !== this.confirmacaoSenha) {
      this.mensagemErro = 'A nova senha e a confirmação não coincidem.';
      return;
    }

    this.carregando = true;
    this.recuperacaoService.confirmarCodigo({
      email: this.email.trim(),
      codigo: this.codigo.trim(),
      novaSenha: this.novaSenha
    }).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/login']);
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível confirmar o código.');
      }
    });
  }

  /** Volta ao passo do e-mail para pedir um código novo. */
  pedirNovoCodigo(): void {
    this.etapa = 'EMAIL';
    this.codigo = '';
    this.novaSenha = '';
    this.confirmacaoSenha = '';
    this.mensagemErro = '';
    this.mensagemInfo = '';
  }

  voltarParaLogin(): void {
    this.router.navigate(['/login']);
  }
}