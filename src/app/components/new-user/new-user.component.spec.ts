import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NewUserComponent } from './new-user.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GenericService } from '../../shared/generic.service';
import { Router } from '@angular/router';

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule, 
        NewUserComponent 
      ],
      providers: [GenericService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled correctly', () => {
    component.myForm.controls['id'].setValue('123');
    component.myForm.controls['name'].setValue('Valid Name');
    component.myForm.controls['description'].setValue('Valid description with more than 10 characters');
    component.myForm.controls['logo'].setValue('Valid logo URL');
    component.myForm.controls['date_release'].setValue('2024-07-21');
    component.myForm.controls['date_revision'].setValue('2025-07-21');

    expect(component.myForm.valid).toBeTrue();
  });

  it('should have an invalid form when required fields are empty', () => {
    component.myForm.controls['id'].setValue('');
    component.myForm.controls['name'].setValue('');
    component.myForm.controls['description'].setValue('');
    component.myForm.controls['logo'].setValue('');
    component.myForm.controls['date_release'].setValue('');
    component.myForm.controls['date_revision'].setValue('');

    expect(component.myForm.invalid).toBeTrue();
  });

  it('should show error messages when fields are touched and invalid', () => {
    component.myForm.controls['date_release'].markAsTouched();
    component.myForm.controls['date_revision'].markAsTouched();
    fixture.detectChanges();

    const dateReleaseError = fixture.debugElement.nativeElement.querySelector('#date_release + .invalid-feedback');
    const dateRevisionError = fixture.debugElement.nativeElement.querySelector('#date_revision + .invalid-feedback');

    expect(dateReleaseError).toBeTruthy();
    expect(dateReleaseError.textContent).toContain('Requiere una fecha de liberación.');
    expect(dateRevisionError).toBeTruthy();
    expect(dateRevisionError.textContent).toContain('Requiere una fecha de revisión.');
  });

  it('should mark all controls as touched when submitting an invalid form', () => {
    spyOn(component.myForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.myForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should call navigate to list user after successful form submission for new user', () => {
    spyOn(router, 'navigate');

    component.myForm.controls['id'].setValue('123');
    component.myForm.controls['name'].setValue('Valid Name');
    component.myForm.controls['description'].setValue('Valid description with more than 10 characters');
    component.myForm.controls['logo'].setValue('Valid logo URL');
    component.myForm.controls['date_release'].setValue('2024-07-21');
    component.myForm.controls['date_revision'].setValue('2025-07-21');

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(router.navigate).toHaveBeenCalledWith(['/listUser']);
  });

  it('should load data and navigate to /listUser after a successful update', () => {
    spyOn(router, 'navigate');
    component.id = '123';

    component.myForm.controls['id'].setValue('123');
    component.myForm.controls['name'].setValue('Valid Name');
    component.myForm.controls['description'].setValue('Valid description with more than 10 characters');
    component.myForm.controls['logo'].setValue('Valid logo URL');
    component.myForm.controls['date_release'].setValue('2024-07-21');
    component.myForm.controls['date_revision'].setValue('2025-07-21');

    component.updateInfo();

    const req = httpMock.expectOne('http://localhost:3002/bp/products/123');
    expect(req.request.method).toBe('PUT');
    req.flush({});

    expect(router.navigate).toHaveBeenCalledWith(['/listUser']);
  });
});
