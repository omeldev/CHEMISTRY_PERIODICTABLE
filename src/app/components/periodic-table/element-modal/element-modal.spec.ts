import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementModal } from './element-modal';

describe('ElementModal', () => {
  let component: ElementModal;
  let fixture: ComponentFixture<ElementModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
