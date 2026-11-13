import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { IconComponent } from '../../components/icon/icon.component';
import { LoginResponse } from '../../core/models';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputComponent, ButtonComponent, IconComponent],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginViewComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  protected readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  protected readonly loading = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);

  handleSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginForm.getRawValue();

    this.http.post<LoginResponse>('http://localhost:3000/auth/login', credentials).subscribe({
      next: (res) => {
        this.loading.set(false);
        localStorage.setItem('stayadmin_token', res.token);
        localStorage.setItem('stayadmin_user', JSON.stringify({ username: credentials.username }));
        this.router.navigate(['/overview']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || 'Helytelen felhasználónév vagy jelszó. Kérjük próbálja újra!';
        this.errorMessage.set(msg);
      },
    });
  }
}
