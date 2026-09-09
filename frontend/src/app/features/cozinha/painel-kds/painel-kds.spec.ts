import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelKds } from './painel-kds';

describe('PainelKds', () => {
  let component: PainelKds;
  let fixture: ComponentFixture<PainelKds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelKds],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelKds);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
