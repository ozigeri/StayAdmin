import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-not-found-view',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './not-found-view.component.html',
  styleUrl: './not-found-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundViewComponent {
  private readonly router = inject(Router);

  goHome(): void {
    this.router.navigate(['/overview']);
  }
}
