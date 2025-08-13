import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  avatar: string;
  phone?: string;
  department?: string;
}

export interface DepartmentStat {
  name: string;
  count: number;
}

export interface Activity {
  icon: string;
  color: string;
  title: string;
  description: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profilesSubject = new BehaviorSubject<UserProfile[]>([]);
  public profiles$ = this.profilesSubject.asObservable();

  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  public activities$ = this.activitiesSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const initialProfiles: UserProfile[] = [
      {
        id: 1,
        name: 'Ana García',
        email: 'ana.garcia@empresa.com',
        role: 'Desarrolladora Senior',
        status: 'active',
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        phone: '+34 600 123 456',
        department: 'Tecnología'
      },
      {
        id: 2,
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@empresa.com',
        role: 'Project Manager',
        status: 'active',
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        phone: '+34 600 234 567',
        department: 'Gestión'
      },
      {
        id: 3,
        name: 'María López',
        email: 'maria.lopez@empresa.com',
        role: 'Diseñadora UX/UI',
        status: 'inactive',
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        phone: '+34 600 345 678',
        department: 'Diseño'
      },
      {
        id: 4,
        name: 'Juan Martínez',
        email: 'juan.martinez@empresa.com',
        role: 'DevOps Engineer',
        status: 'active',
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        phone: '+34 600 456 789',
        department: 'Infraestructura'
      },
      {
        id: 5,
        name: 'Laura Sánchez',
        email: 'laura.sanchez@empresa.com',
        role: 'QA Tester',
        status: 'active',
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        phone: '+34 600 567 890',
        department: 'Calidad'
      }
    ];

    const initialActivities: Activity[] = [
      {
        icon: 'person-add',
        color: 'success',
        title: 'Nuevo perfil agregado',
        description: 'Laura Sánchez se unió al equipo',
        time: 'Hace 2 horas'
      },
      {
        icon: 'create',
        color: 'primary',
        title: 'Perfil actualizado',
        description: 'Carlos Rodríguez actualizó su información',
        time: 'Hace 5 horas'
      },
      {
        icon: 'log-in',
        color: 'tertiary',
        title: 'Inicio de sesión',
        description: 'Ana García accedió al sistema',
        time: 'Hace 1 día'
      }
    ];

    this.profilesSubject.next(initialProfiles);
    this.activitiesSubject.next(initialActivities);
  }

  getProfiles(): UserProfile[] {
    return this.profilesSubject.value;
  }

  addProfile(profile: UserProfile) {
    console.log('Adding profile:', profile); // Debug
    const profiles = this.getProfiles();
    profiles.push(profile);
    this.profilesSubject.next(profiles);
    
    console.log('All profiles after add:', profiles); // Debug
    console.log('Statistics after add:', this.getStatistics()); // Debug
    
    this.addActivity({
      icon: 'person-add',
      color: 'success',
      title: 'Nuevo perfil agregado',
      description: `${profile.name} se unió al equipo (${profile.department})`,
      time: 'Hace unos segundos'
    });
  }

  updateProfile(updatedProfile: UserProfile) {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === updatedProfile.id);
    if (index !== -1) {
      profiles[index] = updatedProfile;
      this.profilesSubject.next(profiles);
      
      this.addActivity({
        icon: 'create',
        color: 'primary',
        title: 'Perfil actualizado',
        description: `${updatedProfile.name} actualizó su información`,
        time: 'Hace unos segundos'
      });
    }
  }

  deleteProfile(profileId: number) {
    const profiles = this.getProfiles();
    const profileToDelete = profiles.find(p => p.id === profileId);
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    this.profilesSubject.next(updatedProfiles);
    
    if (profileToDelete) {
      this.addActivity({
        icon: 'trash',
        color: 'danger',
        title: 'Perfil eliminado',
        description: `${profileToDelete.name} fue eliminado del sistema`,
        time: 'Hace unos segundos'
      });
    }
  }

  private addActivity(activity: Activity) {
    const activities = this.activitiesSubject.value;
    activities.unshift(activity); // Add to beginning
    if (activities.length > 10) {
      activities.pop(); // Keep only last 10 activities
    }
    this.activitiesSubject.next(activities);
  }

  getStatistics() {
    const profiles = this.getProfiles();
    const totalProfiles = profiles.length;
    const activeProfiles = profiles.filter(p => p.status === 'active').length;
    const inactiveProfiles = profiles.filter(p => p.status === 'inactive').length;

    const departmentCount: {[key: string]: number} = {};
    profiles.forEach(profile => {
      if (profile.department) {
        departmentCount[profile.department] = (departmentCount[profile.department] || 0) + 1;
      }
    });

    const departmentStats: DepartmentStat[] = Object.keys(departmentCount).map(dept => ({
      name: dept,
      count: departmentCount[dept]
    }));

    return {
      totalProfiles,
      activeProfiles,
      inactiveProfiles,
      departments: departmentStats.length,
      departmentStats
    };
  }

  exportData(): string {
    const profiles = this.getProfiles();
    return JSON.stringify(profiles, null, 2);
  }

  getAvailableDepartments(): string[] {
    return [
      'Tecnología',
      'Gestión', 
      'Diseño',
      'Infraestructura',
      'Calidad'
    ];
  }

  getAvailableRoles(): string[] {
    return [
      'Desarrolladora Senior',
      'Project Manager',
      'Diseñadora UX/UI', 
      'DevOps Engineer',
      'QA Tester',
      'Desarrollador Full Stack',
      'Analista de Sistemas',
      'Arquitecto de Software'
    ];
  }

  clearCache() {
    // Reset to initial data and clear browser cache
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset profiles and activities to initial state
    this.loadInitialData();
  }
}