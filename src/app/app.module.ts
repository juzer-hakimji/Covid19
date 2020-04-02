import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxGridModule,IgxCardModule,IgxListModule  } from 'igniteui-angular';
import { IgxGeographicMapModule } from 'igniteui-angular-maps';
import { IgxDataChartInteractivityModule } from 'igniteui-angular-charts';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IgxGridModule,
    IgxGeographicMapModule,
        IgxDataChartInteractivityModule,
        IgxCardModule,
        IgxListModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
