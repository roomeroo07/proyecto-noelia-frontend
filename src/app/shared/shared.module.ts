import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReplacePipe } from './replace.pipe';
import { FechaPipe } from './fecha.pipe';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [ReplacePipe, FechaPipe, NavbarComponent],
  imports: [CommonModule, RouterModule],
  exports: [ReplacePipe, FechaPipe, RouterModule, NavbarComponent]
})
export class SharedModule {}