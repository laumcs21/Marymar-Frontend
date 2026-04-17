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
  isDragging = false;

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

  startDrag(event: MouseEvent) {
  this.isDragging = true;
  document.addEventListener('mousemove', this.onDrag);
  document.addEventListener('mouseup', this.stopDrag);
}

onDrag = (event: MouseEvent) => {
  if (!this.isDragging) return;

  const wrapper = document.querySelector('.accessibility-wrapper') as HTMLElement;

  wrapper.style.left = event.clientX + 'px';
  wrapper.style.top = event.clientY + 'px';
};

stopDrag = () => {
  this.isDragging = false;
  document.removeEventListener('mousemove', this.onDrag);
  document.removeEventListener('mouseup', this.stopDrag);
};
}