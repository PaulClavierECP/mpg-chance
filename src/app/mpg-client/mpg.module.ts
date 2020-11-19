import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UserService } from './user.service';
import { DataService } from './data.service';
import { MembersService } from './members.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
})
export class MpgModule {}
