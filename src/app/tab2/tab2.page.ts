import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  totalProfiles = 0;
  activeProfiles = 0;
  inactiveProfiles = 0;
  departments = 0;
  departmentStats: any[] = [];
  recentActivities: any[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.profiles$.subscribe(() => {
      this.updateStatistics();
    });
    
    this.profileService.activities$.subscribe(activities => {
      this.recentActivities = activities;
    });
  }
  
  private updateStatistics() {
    const stats = this.profileService.getStatistics();
    this.totalProfiles = stats.totalProfiles;
    this.activeProfiles = stats.activeProfiles;
    this.inactiveProfiles = stats.inactiveProfiles;
    this.departments = stats.departments;
    this.departmentStats = stats.departmentStats;
  }
}