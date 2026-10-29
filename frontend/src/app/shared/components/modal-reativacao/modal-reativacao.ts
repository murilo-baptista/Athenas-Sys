import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Pergunta "Já existe X desativado. Deseja reativá-lo?" (item 3 da V3).
 * Usado em Categorias, Produtos, Mesas e Funcionários.
 * Quem usa decide o texto e o que acontece em "Sim" / "Não".
 */
@Component({
  selector: 'app-modal-reativacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-reativacao.html',
  styleUrl: './modal-reativacao.css'
})
export class ModalReativacaoComponent {

  @Input() titulo = 'Item desativado';
  @Input() mensagem = '';
  @Input() processando = false;

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
}