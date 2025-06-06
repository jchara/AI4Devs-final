import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jira-sync',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jira-sync.component.html',
  styleUrl: './jira-sync.component.scss'
})
export class JiraSyncComponent implements OnInit {
  constructor() { }
  ngOnInit(): void {}
} 