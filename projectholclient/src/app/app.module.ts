
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ManufacturerComponent } from './manufacturer/manufacturer.component';
import { SaleComponent } from './sale/sale.component';
import { StockistComponent } from './stockist/stockist.component';
import { WarehouseComponent } from './warehouse/warehouse.component';


@NgModule({
  declarations: [
    AppComponent,
    ManufacturerComponent,
    SaleComponent,
    StockistComponent,
    WarehouseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: ManufacturerComponent },
      { path: 'sale', component: SaleComponent },
      { path: 'stockist', component: StockistComponent },
      { path: 'warehouse', component: WarehouseComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' }

    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
