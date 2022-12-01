import { NgModule } from "@angular/core";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ConfirmationService, MessageService } from "primeng/api";

import { AppComponent } from "./app.component";
import { ProductService } from "./product.service";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    TableModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ConfirmPopupModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [ConfirmationService, MessageService, ProductService],
})
export class AppModule {}
