import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MwstatsService } from './mwstats.service';
import {HttpClientModule} from '@angular/common/http'


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    MwstatsService
  ]
})
export class ServicesModule { }
