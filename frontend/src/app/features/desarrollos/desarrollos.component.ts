import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desarrollos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './desarrollos.component.html',
  styleUrl: './desarrollos.component.scss'
})
export class DesarrollosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
