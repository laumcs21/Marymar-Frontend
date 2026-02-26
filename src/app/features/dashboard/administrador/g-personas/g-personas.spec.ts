import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GPersonasComponent } from './g-personas';

describe('GUsuarios', () => {
  let component: GPersonasComponent;
  let fixture: ComponentFixture<GPersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GPersonasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
