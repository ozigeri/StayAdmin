import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { InputComponent } from '../../components/input/input.component';
import { TextareaComponent } from '../../components/textarea/textarea.component';
import { SelectComponent, SelectOption } from '../../components/select/select.component';
import { ButtonComponent } from '../../components/button/button.component';
import { IconComponent } from '../../components/icon/icon.component';
import { EPropertyCategory } from '../../core/models';

@Component({
  selector: 'app-property-form-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './property-form-view.component.html',
  styleUrl: './property-form-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyFormViewComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isEditMode = signal<boolean>(false);
  protected readonly propertyId = signal<string | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  protected readonly imagePreviewUrl = signal<string>('');

  protected readonly propertyForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    location: ['', [Validators.required]],
    address: ['', [Validators.required]],
    category: ['', [Validators.required]],
    description: [''],
    imageUrl: [''],
    roomPrices: this.fb.group({
      Standard: [0, [Validators.required, Validators.min(0)]],
      Superior: [0, [Validators.required, Validators.min(0)]],
      Family: [0, [Validators.required, Validators.min(0)]],
    }),
  });

  readonly categoryOptions: SelectOption[] = [
    { label: 'Hotel', value: EPropertyCategory.Hotel },
    { label: 'Panzió', value: EPropertyCategory.Pension },
    { label: 'Apartman', value: EPropertyCategory.Apartment },
    { label: 'Vendégház', value: EPropertyCategory.Guesthouse },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.propertyId.set(id);
    }

    this.propertyForm.get('imageUrl')?.valueChanges.subscribe((url) => {
      this.imagePreviewUrl.set(url ?? '');
    });
  }

  isFieldInvalid(fieldPath: string): boolean {
    const control = this.propertyForm.get(fieldPath);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getFieldError(fieldPath: string, fieldName: string): string | null {
    const control = this.propertyForm.get(fieldPath);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return null;
    }
    if (control.errors['required']) {
      return `A(z) ${fieldName} megadása kötelező.`;
    }
    if (control.errors['min']) {
      return `A(z) ${fieldName} nem lehet negatív szám.`;
    }
    if (control.errors['minlength']) {
      return `A(z) ${fieldName} legalább 2 karakter hosszú legyen.`;
    }
    return 'Érvénytelen érték.';
  }

  cancel(): void {
    this.router.navigate(['/properties']);
  }

  submit(): void {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }
  }
}
