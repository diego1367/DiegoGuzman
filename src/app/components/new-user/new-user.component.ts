import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../shared/generic.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  standalone: true,
  imports:[CommonModule, ReactiveFormsModule],
  styleUrls: ['./new-user.component.css'],
  providers:  [ GenericService ]
})
export class NewUserComponent implements OnInit {

  myForm: FormGroup;
  id: any;
  isIdDisabled: boolean;

  constructor(
    private fb: FormBuilder,
    private genericService: GenericService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isIdDisabled = this.id !== 'null';
    this.myForm = this.fb.group({
      id: [{ value: null, disabled: this.isIdDisabled }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: [null, [Validators.required]],
      date_release: ['', [Validators.required, this.dateReleaseValidator]],
      date_revision: ['', [Validators.required, this.dateRevisionValidator.bind(this)]]
    });
  }

  ngOnInit(): void {
    if (this.id !== 'null') {
      this.loadFormData();
    }
    this.myForm.get('date_release')?.valueChanges.subscribe(() => {
      this.myForm.get('date_revision')?.updateValueAndValidity();
    });
  }

  loadFormData(): void {
    this.genericService.getById(this.id).subscribe({
      next: (response) => {
        this.myForm.patchValue({
          id: response?.id,
          name: response?.name,
          description: response?.description,
          logo: response?.logo,
          date_release: response?.date_release,
          date_revision: response?.date_revision
        });
      },
      complete: () => {
        console.log('Datos obtenidos exitosamente.');
      }
    });
  }

  onSubmit(): void {
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      this.genericService.post(this.myForm.value).subscribe({
        next: () => {
          this.router.navigate(['/listUser']);
        },
        error: (error) => {
          alert(error.error.message);
          console.log(error);
        },
        complete: () => {
          alert('Se guardó con éxito');
        }
      });
    }
  }

  updateInfo(): void {
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      this.genericService.put(this.id, this.myForm.value).subscribe({
        next: () => {
          this.router.navigate(['/listUser']);
        },
        error: (error) => {
          alert(error.error.message);
          console.log(error);
        },
        complete: () => {
          alert('Se actualizó con éxito');
        }
      });
    }
  }

  onReset(): void {
    this.myForm.reset();
  }

  dateReleaseValidator(control: AbstractControl): ValidationErrors | null {
    const dateRelease = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    dateRelease.setHours(0, 0, 0, 0);

    return dateRelease >= today ? null : { dateReleaseInvalid: true };
  }

  dateRevisionValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.parent) {
      return null;
    }
    const dateRelease = new Date(control.parent.get('date_release')?.value);
    const dateRevision = new Date(control.value);
    const expectedRevisionDate = new Date(dateRelease);
    expectedRevisionDate.setFullYear(dateRelease.getFullYear() + 1);
    expectedRevisionDate.setHours(0, 0, 0, 0);

    return dateRevision.setHours(0, 0, 0, 0) === expectedRevisionDate.setHours(0, 0, 0, 0) ? null : { dateRevisionInvalid: true };
  }
}
