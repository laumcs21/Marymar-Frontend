import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeseroComponent } from './mesero';

describe('Mesero', () => {
  let component: MeseroComponent;
  let fixture: ComponentFixture<MeseroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeseroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeseroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
