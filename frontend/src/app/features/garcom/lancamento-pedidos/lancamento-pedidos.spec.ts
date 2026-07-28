import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancamentoPedidos } from './lancamento-pedidos';

describe('LancamentoPedidos', () => {
  let component: LancamentoPedidos;
  let fixture: ComponentFixture<LancamentoPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancamentoPedidos],
    }).compileComponents();

    fixture = TestBed.createComponent(LancamentoPedidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
