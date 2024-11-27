import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexmonsterPivotModule } from "ngx-flexmonster";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FlexmonsterPivotModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
