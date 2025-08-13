import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { ProfileFormModalComponent } from '../components/profile-form-modal/profile-form-modal.component';
import { RoleSelectorComponent } from '../components/role-selector/role-selector.component';

import { Tab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [
    Tab1Page, 
    ProfileModalComponent, 
    ProfileFormModalComponent, 
    RoleSelectorComponent
  ]
})
export class Tab1PageModule {}
