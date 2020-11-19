import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MpgModule } from '../mpg-client/mpg.module';
import { CalendarService } from './calendar.service';

@NgModule({
  imports: [CommonModule, MpgModule],
})
export class SimulationModule {}
