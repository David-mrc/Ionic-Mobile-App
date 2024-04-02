import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListDetailsPage } from './list-details.page';

describe('ListDetailsPage', () => {
  let component: ListDetailsPage;
  let fixture: ComponentFixture<ListDetailsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ListDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
