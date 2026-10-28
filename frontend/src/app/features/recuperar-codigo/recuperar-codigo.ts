import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecuperacaoCodigoService } from '../../core/services/recuperacao-codigo.service';
import { mensagemDeErro } from '../../core/utils/mensagem-erro';

type Etapa = 'USUARIO' | 'CODIGO';

@Component({
  selector: 'app-recuperar-codigo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-codigo.html',
  styleUrl: './recuperar-codigo.css'
})
export class RecuperarCodigoComponent {

  etapa: Etapa = 'USUARIO';
  carregando = false;
  mensagemErro = '';
  mensagemInfo = '';

  usuario = '';
  codigoAutenticacao = '';
  novoCodigo = '';
  confirmacaoCodigo = '';

  constructor(
    private recuperacaoCodigoService: RecuperacaoCodigoService,
    private location: Location
  ) {}

  solicitar(): void {
    this.mensagemErro = '';
    this.mensagemInfo = '';

    if (!this.usuario.trim()) {
      this.mensagemErro = 'Informe o seu usuário.';
      return;
    }

    this.carregando = true;
    this.recuperacaoCodigoService.solicitar({ usuario: this.usuario.trim() }).subscribe({
      next: () => {
        this.carregando = false;
        this.mensagemInfo = 'Enviamos um código de autenticação ao e-mail do restaurante. Peça-o ao gerente.';
        this.etapa = 'CODIGO';
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível enviar o pedido agora. Tente novamente.');
      }
    });
  }

  confirmar(): void {
    this.mensagemErro = '';

    if (!this.codigoAutenticacao.trim() || !this.novoCodigo || !this.confirmacaoCodigo) {
      this.mensagemErro = 'Preencha o código de autenticação e o novo código.';
      return;
    }
    if (this.novoCodigo !== this.confirmacaoCodigo) {
      this.mensagemErro = 'O novo código e a confirmação não coincidem.';
      return;
    }

    this.carregando = true;
    this.recuperacaoCodigoService.confirmar({
      usuario: this.usuario.trim(),
      codigoAutenticacao: this.codigoAutenticacao.trim(),
      novoCodigo: this.novoCodigo
    }).subscribe({
      next: () => {
        this.carregando = false;
        this.location.back(); // volta para a tela "Autentique o funcionário"
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = mensagemDeErro(erro, 'Não foi possível confirmar o código.');
      }
    });
  }

  digitarOutroUsuario(): void {
    this.etapa = 'USUARIO';
    this.codigoAutenticacao = '';
    this.novoCodigo = '';
    this.confirmacaoCodigo = '';
    this.mensagemErro = '';
    this.mensagemInfo = '';
  }

  voltar(): void {
    this.location.back();
  }
}