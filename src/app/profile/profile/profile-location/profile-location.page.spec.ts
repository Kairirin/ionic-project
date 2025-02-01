import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileLocationPage } from './profile-location.page';

describe('ProfileLocationPage', () => {
  let component: ProfileLocationPage;
  let fixture: ComponentFixture<ProfileLocationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
