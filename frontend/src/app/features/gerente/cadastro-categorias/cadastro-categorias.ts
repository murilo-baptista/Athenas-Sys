import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { CategoriaListagem } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-cadastro-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-categorias.html'
})
export class CadastroCategoriasComponent implements OnInit {

  categorias: CategoriaListagem[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';

  idEmEdicao: number | null = null;
  nome = '';

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.categoriaService.listarPorRestaurante().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar as categorias.';
      }
    });
  }

  editar(categoria: CategoriaListagem): void {
    this.idEmEdicao = categoria.id;
    this.nome = categoria.nome;
  }

  cancelarEdicao(): void {
    this.idEmEdicao = null;
    this.nome = '';
  }

  salvar(): void {
    if (!this.nome.trim()) {
      this.mensagemErro = 'Informe o nome da categoria.';
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';
    const dados = { nome: this.nome.trim() };

    const requisicao$ = this.idEmEdicao
      ? this.categoriaService.atualizar(this.idEmEdicao, dados)
      : this.categoriaService.criar(dados);

    requisicao$.subscribe({
      next: () => {
        this.salvando = false;
        this.cancelarEdicao();
        this.carregar();
      },
      error: () => {
        this.salvando = false;
        this.mensagemErro = 'Não foi possível salvar a categoria.';
      }
    });
  }

  remover(categoria: CategoriaListagem): void {
    if (!confirm(`Remover a categoria "${categoria.nome}"? Produtos vinculados a ela podem ser afetados.`)) {
      return;
    }

    this.categoriaService.desativar(categoria.id).subscribe({
      next: () => this.carregar(),
      error: () => (this.mensagemErro = `Não foi possível remover "${categoria.nome}" — verifique se ainda há produtos vinculados a ela.`)
    });
  }
}