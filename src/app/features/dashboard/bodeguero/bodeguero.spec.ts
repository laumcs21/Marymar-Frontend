import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodegueroComponent } from './bodeguero';

describe('Bodeguero', () => {
  let component: BodegueroComponent;
  let fixture: ComponentFixture<BodegueroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodegueroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodegueroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
