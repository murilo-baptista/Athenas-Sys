import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // Usamos o template inline para carregar as rotas diretamente sem depender de arquivos HTML externos
  template: '<router-outlet></router-outlet>'
})
export class App {
  title = 'athenas-sys-frontend';
}