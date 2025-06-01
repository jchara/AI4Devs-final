import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-microservices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './microservices.component.html',
  styleUrl: './microservices.component.scss'
})
export class MicroservicesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

} 