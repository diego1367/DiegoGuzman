import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListUserComponent } from './list-user.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { GenericService } from '../../shared/generic.service';
import { By } from '@angular/platform-browser';

describe('ListUserComponent', () => {
  let component: ListUserComponent;
  let fixture: ComponentFixture<ListUserComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListUserComponent,
        HttpClientTestingModule,
      ],
      providers: [
        GenericService,
        provideRouter([], withEnabledBlockingInitialNavigation()),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render product table with data', () => {
    component.paginatedRecords = [
      { logo: 'logo1.png', name: 'Product 1', description: 'Description 1', date_release: '2023-01-01', date_revision: '2023-01-02' },
      { logo: 'logo2.png', name: 'Product 2', description: 'Description 2', date_release: '2023-02-01', date_revision: '2023-02-02' }
    ];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should call filterTable method on input event', () => {
    spyOn(component, 'filterTable');
    const input = fixture.debugElement.query(By.css('#search')).nativeElement;
    input.dispatchEvent(new Event('input'));
    expect(component.filterTable).toHaveBeenCalled();
  });

  it('should call navigateToAbout method on button click', () => {
    spyOn(component, 'navigateToAbout');
    const button = fixture.debugElement.query(By.css('.btn.submit')).nativeElement;
    button.click();
    expect(component.navigateToAbout).toHaveBeenCalled();
  });

  it('should call editRecord method when Editar is clicked', () => {
    spyOn(component, 'editRecord');
    component.paginatedRecords = [
      { logo: 'logo1.png', name: 'Product 1', description: 'Description 1', date_release: '2023-01-01', date_revision: '2023-01-02' }
    ];
    fixture.detectChanges();
    const editButton = fixture.debugElement.query(By.css('.dropdown-item')).nativeElement;
    editButton.click();
    expect(component.editRecord).toHaveBeenCalledWith(component.paginatedRecords[0]);
  });

  it('should call deleteRecord method when Eliminar is clicked', () => {
    spyOn(component, 'deleteRecord');
    component.paginatedRecords = [
      { logo: 'logo1.png', name: 'Product 1', description: 'Description 1', date_release: '2023-01-01', date_revision: '2023-01-02' }
    ];
    fixture.detectChanges();
    const deleteButton = fixture.debugElement.query(By.css('.dropdown-item:nth-child(2)')).nativeElement;
    deleteButton.click();
    expect(component.deleteRecord).toHaveBeenCalledWith(component.paginatedRecords[0]);
  });

  it('should update recordsPerPage when selection changes', () => {
    const select = fixture.debugElement.query(By.css('#recordsPerPage')).nativeElement;
    select.value = select.options[1].value; // Seleccionar la segunda opción
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.recordsPerPage).toBe(parseInt(select.value, 10));
  });
});
