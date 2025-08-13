import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-role-selector',
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss'],
  standalone: false,
})
export class RoleSelectorComponent implements OnInit {
  @Input() roles: string[] = [];
  @Input() selectedRole: string = '';

  filteredRoles: string[] = [];
  searchTerm: string = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.filteredRoles = [...this.roles];
  }

  filterRoles() {
    if (!this.searchTerm.trim()) {
      this.filteredRoles = [...this.roles];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredRoles = this.roles.filter(role => 
        role.toLowerCase().includes(term)
      );
    }
  }

  roleExists(): boolean {
    return this.roles.some(role => 
      role.toLowerCase() === this.searchTerm.toLowerCase()
    );
  }

  selectRole(role: string) {
    this.modalController.dismiss(role);
  }

  addNewRole() {
    if (this.searchTerm && !this.roleExists()) {
      this.modalController.dismiss(this.searchTerm);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}