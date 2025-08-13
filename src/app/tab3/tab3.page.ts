import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ProfileService } from '../services/profile';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  settings = {
    notifications: true,
    darkMode: false,
    autoSync: true
  };

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    // Load saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      this.settings.darkMode = savedDarkMode === 'true';
      this.applyDarkMode();
    }
  }

  private applyDarkMode() {
    if (this.settings.darkMode) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('ion-palette-dark');
    }
  }

  toggleDarkMode() {
    // Apply dark mode changes
    this.applyDarkMode();
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', this.settings.darkMode.toString());
  }

  async exportData() {
    const alert = await this.alertController.create({
      header: 'Exportar Datos',
      message: 'Se exportarán todos los perfiles en formato JSON',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Exportar',
          handler: async () => {
            try {
              const data = this.profileService.exportData();
              const blob = new Blob([data], { type: 'application/json' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `perfiles_${new Date().getTime()}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              await this.showToast('Datos exportados correctamente');
            } catch (error) {
              await this.showToast('Error al exportar datos');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async clearCache() {
    const alert = await this.alertController.create({
      header: 'Limpiar Caché',
      message: '¿Estás seguro de que deseas limpiar el caché de la aplicación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Limpiar',
          handler: async () => {
            try {
              this.profileService.clearCache();
              await this.showToast('Caché limpiado correctamente');
            } catch (error) {
              await this.showToast('Error al limpiar el caché');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          handler: async () => {
            try {
              // Clear all data and reset to initial state
              this.profileService.clearCache();
              localStorage.removeItem('user_session');
              sessionStorage.clear();
              
              await this.showToast('Sesión cerrada exitosamente');
              
              // In a real app, you would navigate to login page
              // this.router.navigate(['/login']);
              
              // For demo purposes, we'll reload the page
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } catch (error) {
              await this.showToast('Error al cerrar sesión');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}