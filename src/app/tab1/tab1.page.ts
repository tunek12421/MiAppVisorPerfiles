import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { ProfileService, UserProfile } from '../services/profile';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  profiles: UserProfile[] = [];
  filteredProfiles: UserProfile[] = [];
  searchTerm: string = '';

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.profileService.profiles$.subscribe(profiles => {
      this.profiles = profiles;
      this.filterProfiles();
    });
  }

  loadProfiles() {
    // Data is now managed by the service
    // This method is kept for the refresh functionality
    this.filterProfiles();
  }

  filterProfiles() {
    if (this.searchTerm.trim() === '') {
      this.filteredProfiles = [...this.profiles];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProfiles = this.profiles.filter(profile =>
        profile.name.toLowerCase().includes(term) ||
        profile.email.toLowerCase().includes(term) ||
        profile.role.toLowerCase().includes(term)
      );
    }
  }

  async viewProfile(profile: UserProfile) {
    const modal = await this.modalController.create({
      component: ProfileModalComponent,
      componentProps: {
        profile: profile
      }
    });
    return await modal.present();
  }

  async addProfile() {
    const departments = this.profileService.getAvailableDepartments();
    const roles = this.profileService.getAvailableRoles();
    
    const alert = await this.alertController.create({
      header: 'Nuevo Perfil',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre completo'
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'Correo electrónico'
        },
        {
          name: 'role',
          type: 'text',
          placeholder: 'Cargo (ej: Project Manager, QA Tester...)'
        },
        {
          name: 'department',
          type: 'text',
          placeholder: 'Departamento (Tecnología, Gestión, Diseño, Infraestructura, Calidad)'
        }
      ],
      message: 'Completa la información del nuevo perfil:',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.name && data.email && data.role) {
              const newProfile: UserProfile = {
                id: Date.now(),
                name: data.name,
                email: data.email,
                role: data.role,
                department: data.department || 'Tecnología',
                status: 'active',
                avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg'
              };
              this.profileService.addProfile(newProfile);
              await this.showToast('Perfil agregado correctamente');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editProfile(profile: UserProfile) {
    const alert = await this.alertController.create({
      header: 'Editar Perfil',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: profile.name,
          placeholder: 'Nombre completo'
        },
        {
          name: 'email',
          type: 'email',
          value: profile.email,
          placeholder: 'Correo electrónico'
        },
        {
          name: 'role',
          type: 'text',
          value: profile.role,
          placeholder: 'Cargo'
        },
        {
          name: 'department',
          type: 'text',
          value: profile.department || '',
          placeholder: 'Departamento'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Actualizar',
          handler: async (data) => {
            if (data.name && data.email && data.role) {
              const updatedProfile = { 
                ...profile, 
                name: data.name, 
                email: data.email, 
                role: data.role,
                department: data.department || profile.department
              };
              this.profileService.updateProfile(updatedProfile);
              await this.showToast('Perfil actualizado correctamente');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteProfile(profile: UserProfile) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar el perfil de ${profile.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            this.profileService.deleteProfile(profile.id);
            await this.showToast('Perfil eliminado');
          }
        }
      ]
    });
    await alert.present();
  }

  async handleRefresh(event: any) {
    setTimeout(() => {
      this.loadProfiles();
      event.target.complete();
    }, 1500);
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
}