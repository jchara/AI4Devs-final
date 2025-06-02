import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DevTracker';

  constructor() {
  
    if (environment.production) {
      console.log('✅ Ejecutándose en PRODUCCIÓN');
    } else {
      console.log('🔧 Ejecutándose en DESARROLLO');
    }
  }
}
