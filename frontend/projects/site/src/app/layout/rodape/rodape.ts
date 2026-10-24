import { Component } from '@angular/core';
import { SITE } from '../../config/site.config';

@Component({
  selector: 'app-rodape',
  templateUrl: './rodape.html',
  styleUrl: './rodape.css'
})
export class Rodape {
  site = SITE;
}