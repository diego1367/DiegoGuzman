import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { By } from '@angular/platform-browser';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('.dialog-header')).nativeElement;
    expect(titleElement.textContent).toContain('Test Title');
  });

  it('should emit confirm event on confirm button click', () => {
    spyOn(component.confirm, 'emit');
    const confirmButton = fixture.debugElement.query(By.css('.btn.confirm')).nativeElement;
    confirmButton.click();
    expect(component.confirm.emit).toHaveBeenCalled();
  });

  it('should emit cancel event on cancel button click', () => {
    spyOn(component.cancel, 'emit');
    const cancelButton = fixture.debugElement.query(By.css('.btn.cancel')).nativeElement;
    cancelButton.click();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
