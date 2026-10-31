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
  codigo = '';
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
        this.mensagemErro = this.mensagemDoErro(erro, 'Não foi possível enviar o pedido agora. Tente novamente.');
      }
    });
  }

  confirmar(): void {
    this.mensagemErro = '';

    if (!this.codigo.trim() || !this.novoCodigo || !this.confirmacaoCodigo) {
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
      codigo: this.codigo.trim(),
      novoCodigo: this.novoCodigo
    }).subscribe({
      next: () => {
        this.carregando = false;
        this.location.back(); // volta para a tela "Autentique o funcionário"
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = this.mensagemDoErro(erro, 'Não foi possível confirmar o código.');
      }
    });
  }

  digitarOutroUsuario(): void {
    this.etapa = 'USUARIO';
    this.codigo = '';
    this.novoCodigo = '';
    this.confirmacaoCodigo = '';
    this.mensagemErro = '';
    this.mensagemInfo = '';
  }

  voltar(): void {
    this.location.back();
  }

  /**
   * O back só aceita esta operação com a sessão do RESTAURANTE. Se a sessão
   * atual for de um funcionário, ele responde 403: orienta a refazer o login.
   * Código incorreto/vencido (400) e limite de tentativas (429) vêm do back.
   */
  private mensagemDoErro(erro: any, padrao: string): string {
    if (erro?.status === 403) {
      return 'Esta ação exige a sessão do restaurante. Volte ao login do restaurante e tente de novo.';
    }
    return mensagemDeErro(erro, padrao);
  }
}