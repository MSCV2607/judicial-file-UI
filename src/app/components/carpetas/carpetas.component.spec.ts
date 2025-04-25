import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpetasComponent } from './carpetas.component';

describe('CarpetasComponent', () => {
  let component: CarpetasComponent;
  let fixture: ComponentFixture<CarpetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarpetasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarpetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
