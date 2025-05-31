import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-microservicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './microservicios.component.html',
  styleUrl: './microservicios.component.scss'
})
export class MicroserviciosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
