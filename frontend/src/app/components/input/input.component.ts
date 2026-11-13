import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<string>('text');
  readonly id = input<string>(`app-input-${Math.random().toString(36).substring(2, 9)}`);
  readonly required = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly min = input<number | string | null>(null);
  readonly max = input<number | string | null>(null);
  readonly step = input<number | string | null>(null);
  readonly disabledInput = input<boolean>(false);

  protected readonly value = signal<string | number>('');
  protected readonly isDisabled = signal<boolean>(false);

  private onChange: (value: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: any): void {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const val = this.type() === 'number' && target.value !== '' ? Number(target.value) : target.value;
    this.value.set(val);
    this.onChange(val);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
