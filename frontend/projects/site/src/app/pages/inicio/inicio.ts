import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../config/site.config';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  site = SITE;

  funcionalidades = [
    {
      icone: 'icone-mesa.png',
      titulo: 'Mesas e Reservas',
      texto: 'Gerencie reservas, libere e acompanhe o status das mesas.'
    },
    {
      icone: 'icone-cloche.png',
      titulo: 'Pedidos',
      texto: 'Lance, acompanhe e atualize os pedidos em tempo real.'
    },
    {
      icone: 'icone-chapeu-chef.png',
      titulo: 'Cozinha',
      texto: 'Visualize o preparo e o status dos pedidos no painel KDS.'
    },
    {
      icone: 'icone-grafico.png',
      titulo: 'Gestão',
      texto: 'Acompanhe métricas, estoque e muito mais, tudo de forma simples.'
    }
  ];
}