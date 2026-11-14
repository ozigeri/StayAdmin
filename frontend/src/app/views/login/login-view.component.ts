import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { IconComponent } from '../../components/icon/icon.component';
import * as AuthActions from '../../state/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../state/auth/auth.selectors';
import { LoginRequest } from '../../core/models';

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
  private readonly store = inject(Store);

  protected readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  protected readonly loading = this.store.selectSignal(selectAuthLoading);
  protected readonly errorMessage = this.store.selectSignal(selectAuthError);

  handleSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.getRawValue() as LoginRequest;
    this.store.dispatch(AuthActions.login({ credentials }));
  }
}
