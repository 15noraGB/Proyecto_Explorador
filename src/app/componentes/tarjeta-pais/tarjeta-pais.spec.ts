import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaPais } from './tarjeta-pais';

describe('TarjetaPais', () => {
  let component: TarjetaPais;
  let fixture: ComponentFixture<TarjetaPais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaPais]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TarjetaPais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
