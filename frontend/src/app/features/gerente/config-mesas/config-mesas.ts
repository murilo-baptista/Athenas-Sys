import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MesaService } from '../../../core/services/mesa.service';
import { MesaListagem } from '../../../core/models/mesa.model';

interface FormularioMesa {
  numero: number | null;
  capacidade: number | null;
}

@Component({
  selector: 'app-config-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './config-mesas.html'
})
export class ConfigMesasComponent implements OnInit {

  mesas: MesaListagem[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';

  idEmEdicao: number | null = null;
  form: FormularioMesa = this.formVazio();

  constructor(private mesaService: MesaService) {}

  ngOnInit(): void {
    this.carregar();
  }

  private formVazio(): FormularioMesa {
    return { numero: null, capacidade: null };
  }

  carregar(): void {
    this.carregando = true;
    this.mesaService.listarPorRestaurante().subscribe({
      next: (mesas) => {
        this.mesas = mesas;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar as mesas.';
      }
    });
  }

  editar(mesa: MesaListagem): void {
    this.idEmEdicao = mesa.id;
    this.form = { numero: mesa.numero, capacidade: mesa.capacidade };
  }

  cancelarEdicao(): void {
    this.idEmEdicao = null;
    this.form = this.formVazio();
  }

  salvar(): void {
    if (!this.form.numero || this.form.numero <= 0 || !this.form.capacidade || this.form.capacidade <= 0) {
      this.mensagemErro = 'Preencha número e capacidade (maiores que zero).';
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';

    const dados = { numero: this.form.numero, capacidade: this.form.capacidade };

    const requisicao$ = this.idEmEdicao
      ? this.mesaService.atualizar(this.idEmEdicao, dados)
      : this.mesaService.criar(dados);

    requisicao$.subscribe({
      next: () => {
        this.salvando = false;
        this.cancelarEdicao();
        this.carregar();
      },
      error: () => {
        this.salvando = false;
        this.mensagemErro = 'Não foi possível salvar a mesa. Verifique se o número já não está em uso.';
      }
    });
  }

  remover(mesa: MesaListagem): void {
    if (!confirm(`Remover a mesa ${mesa.numero}?`)) return;

    this.mesaService.desativar(mesa.id).subscribe({
      next: () => this.carregar(),
      error: () => (this.mensagemErro = `Não foi possível remover a mesa ${mesa.numero}.`)
    });
  }
}