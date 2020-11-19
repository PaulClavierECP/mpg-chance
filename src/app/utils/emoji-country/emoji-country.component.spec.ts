import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiCountryComponent } from './emoji-country.component';

describe('EmojiCountryComponent', () => {
  let component: EmojiCountryComponent;
  let fixture: ComponentFixture<EmojiCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmojiCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmojiCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
