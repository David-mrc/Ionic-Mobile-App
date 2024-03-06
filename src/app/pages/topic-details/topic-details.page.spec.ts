import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicDetailsPage } from './topic-details.page';

describe('TopicDetailsPage', () => {
  let component: TopicDetailsPage;
  let fixture: ComponentFixture<TopicDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TopicDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
