import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('Válassz...');
  readonly id = input<string>(`app-select-${Math.random().toString(36).substring(2, 9)}`);
  readonly required = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly disabledInput = input<boolean>(false);
  readonly options = input<SelectOption[]>([]);

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

  handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
