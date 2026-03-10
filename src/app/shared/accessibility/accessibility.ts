import { Component, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accessibility',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accessibility.html',
  styleUrl: './accessibility.css'
})
export class AccessibilityComponent {
  private renderer = inject(Renderer2);

  open = false;
  fontScale = 1;

  toggleMenu() {
    this.open = !this.open;
  }

  increaseText() {
    if (this.fontScale < 1.4) {
      this.fontScale += 0.1;
      this.applyFontScale();
    }
  }

  decreaseText() {
    if (this.fontScale > 0.8) {
      this.fontScale -= 0.1;
      this.applyFontScale();
    }
  }

  toggleContrast() {
    document.body.classList.toggle('high-contrast');
  }

  reset() {
    this.fontScale = 1;
    document.documentElement.style.setProperty('--app-font-scale', '1');
    document.body.classList.remove('high-contrast');
  }

  private applyFontScale() {
    document.documentElement.style.setProperty(
      '--app-font-scale',
      this.fontScale.toFixed(1)
    );
  }
}