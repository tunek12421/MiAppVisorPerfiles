import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfileService, UserProfile } from '../../services/profile';
import { RoleSelectorComponent } from '../role-selector/role-selector.component';

@Component({
  selector: 'app-profile-form-modal',
  templateUrl: './profile-form-modal.component.html',
  styleUrls: ['./profile-form-modal.component.scss'],
  standalone: false,
})
export class ProfileFormModalComponent implements OnInit {
  @Input() profile?: UserProfile;
  
  formData: any = {
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    avatar: '',
    status: 'active'
  };

  isActive = true;
  availableDepartments: string[] = [];
  availableRoles: string[] = [];

  constructor(
    private modalController: ModalController,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.availableDepartments = this.profileService.getAvailableDepartments();
    this.availableRoles = this.profileService.getAvailableRoles();

    if (this.profile) {
      this.formData = { ...this.profile };
      this.isActive = this.profile.status === 'active';
    }
  }

  selectDepartment(dept: string) {
    this.formData.department = dept;
  }

  getDepartmentIcon(dept: string): string {
    const icons: {[key: string]: string} = {
      'Tecnología': 'code-slash-outline',
      'Gestión': 'people-outline',
      'Diseño': 'color-palette-outline',
      'Infraestructura': 'server-outline',
      'Calidad': 'shield-checkmark-outline'
    };
    return icons[dept] || 'business-outline';
  }

  async openRoleSelector() {
    const modal = await this.modalController.create({
      component: RoleSelectorComponent,
      componentProps: {
        roles: this.availableRoles,
        selectedRole: this.formData.role
      },
      cssClass: 'role-selector-modal'
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.formData.role = data;
    }
  }

  async selectAvatar() {
    // Simulación - En producción aquí iría la lógica para seleccionar imagen
    const avatars = [
      'https://ionicframework.com/docs/img/demos/avatar.svg',
      'https://i.pravatar.cc/150?img=1',
      'https://i.pravatar.cc/150?img=2',
      'https://i.pravatar.cc/150?img=3',
      'https://i.pravatar.cc/150?img=4',
      'https://i.pravatar.cc/150?img=5'
    ];
    
    // Seleccionar avatar aleatorio para demostración
    this.formData.avatar = avatars[Math.floor(Math.random() * avatars.length)];
  }

  isFormValid(): boolean {
    return !!(
      this.formData.name && 
      this.formData.email && 
      this.formData.role && 
      this.formData.department &&
      this.validateEmail(this.formData.email) &&
      this.validateName(this.formData.name) &&
      (!this.formData.phone || this.validatePhone(this.formData.phone))
    );
  }

  validateEmail(email: string): boolean {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validatePhone(phone: string): boolean {
    if (!phone) return true; // Phone is optional
    // Spanish phone patterns: +34 XXX XXX XXX, 6XX XXX XXX, 9XX XXX XXX
    const re = /^(\+34\s?)?[6-9]\d{2}\s?\d{3}\s?\d{3}$/;
    return re.test(phone.replace(/\s/g, ''));
  }

  validateName(name: string): boolean {
    if (!name) return false;
    // Only letters, spaces, accents, and hyphens
    const re = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/;
    return re.test(name) && name.trim().length >= 2;
  }

  // Validation status getters for UI feedback
  get isNameValid(): boolean {
    return !this.formData.name || this.validateName(this.formData.name);
  }

  get isEmailValid(): boolean {
    return !this.formData.email || this.validateEmail(this.formData.email);
  }

  get isPhoneValid(): boolean {
    return !this.formData.phone || this.validatePhone(this.formData.phone);
  }

  get nameError(): string {
    if (!this.formData.name) return '';
    if (this.formData.name.trim().length < 2) return 'Mínimo 2 caracteres';
    if (!this.validateName(this.formData.name)) return 'Solo letras y espacios';
    return '';
  }

  get emailError(): string {
    if (!this.formData.email) return '';
    if (!this.validateEmail(this.formData.email)) return 'Email no válido';
    return '';
  }

  get phoneError(): string {
    if (!this.formData.phone) return '';
    if (!this.validatePhone(this.formData.phone)) return 'Formato: +34 600 123 456';
    return '';
  }

  dismiss() {
    this.modalController.dismiss();
  }

  save() {
    if (this.isFormValid()) {
      const profileData = {
        ...this.formData,
        status: this.isActive ? 'active' : 'inactive',
        avatar: this.formData.avatar || 'https://ionicframework.com/docs/img/demos/avatar.svg'
      };
      this.modalController.dismiss(profileData, 'save');
    }
  }
}