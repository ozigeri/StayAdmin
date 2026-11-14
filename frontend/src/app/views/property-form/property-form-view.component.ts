import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CardComponent } from '../../components/card/card.component';
import { InputComponent } from '../../components/input/input.component';
import { TextareaComponent } from '../../components/textarea/textarea.component';
import { SelectComponent, SelectOption } from '../../components/select/select.component';
import { ButtonComponent } from '../../components/button/button.component';
import { IconComponent } from '../../components/icon/icon.component';
import { EPropertyCategory, PropertyDto } from '../../core/models';
import * as PropertiesActions from '../../state/properties/properties.actions';
import {
  selectPropertiesSaving,
  selectSelectedProperty,
} from '../../state/properties/properties.selectors';

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
  private readonly store = inject(Store);

  protected readonly isEditMode = signal<boolean>(false);
  protected readonly propertyId = signal<string | null>(null);
  protected readonly imagePreviewUrl = signal<string>('');

  protected readonly saving = this.store.selectSignal(selectPropertiesSaving);
  private readonly selectedProperty = this.store.selectSignal(
    selectSelectedProperty
  );

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

  constructor() {
    effect(() => {
      const prop = this.selectedProperty();
      if (this.isEditMode() && prop && prop.id === this.propertyId()) {
        this.propertyForm.patchValue({
          name: prop.name,
          location: prop.location,
          address: prop.address,
          category: prop.category,
          description: prop.description,
          imageUrl: prop.imageUrl,
          roomPrices: {
            Standard: prop.roomPrices.Standard,
            Superior: prop.roomPrices.Superior,
            Family: prop.roomPrices.Family,
          },
        });
        this.imagePreviewUrl.set(prop.imageUrl || '');
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.propertyId.set(id);
      this.store.dispatch(PropertiesActions.loadPropertyById({ id }));
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

    const raw = this.propertyForm.getRawValue();
    const dto: PropertyDto = {
      name: raw.name,
      location: raw.location,
      address: raw.address,
      category: raw.category,
      description: raw.description ?? '',
      imageUrl: raw.imageUrl ?? '',
      roomPrices: {
        Standard: Number(raw.roomPrices.Standard),
        Superior: Number(raw.roomPrices.Superior),
        Family: Number(raw.roomPrices.Family),
      },
    };

    if (this.isEditMode() && this.propertyId()) {
      this.store.dispatch(
        PropertiesActions.updateProperty({
          id: this.propertyId()!,
          dto,
        })
      );
    } else {
      this.store.dispatch(PropertiesActions.createProperty({ dto }));
    }
  }
}
