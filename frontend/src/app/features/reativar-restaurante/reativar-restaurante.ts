import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecuperacaoService } from '../../core/services/recuperacao.service';
import { mensagemDeErro } from '../../core/utils/mensagem-erro';

type Etapa = 'EMAIL' | 'CODIGO';

@Component({
  selector: 'app-reativar-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reativar-restaurante.html',
  styleUrl: './reativar-restaurante.css'
})
export class ReativarRestauranteComponent {

  etapa: Etapa = 'EMAIL';
  carregando = false;
  mensagemErro = '';
  mensagemInfo = '';

  email = '';
  codigo = '';

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
    this.recuperacaoService.solicitarCodigoReativacao({ email: this.email.trim() }).subscribe({
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

    if (!this.codigo.trim()) {
      this.mensagemErro = 'Informe o código recebido.';
      return;
    }

    this.carregando = true;
    this.recuperacaoService.confirmarReativacao({
      email: this.email.trim(),
      codigo: this.codigo.trim()
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

  pedirNovoCodigo(): void {
    this.etapa = 'EMAIL';
    this.codigo = '';
    this.mensagemErro = '';
    this.mensagemInfo = '';
  }

  voltarParaLogin(): void {
    this.router.navigate(['/login']);
  }
}