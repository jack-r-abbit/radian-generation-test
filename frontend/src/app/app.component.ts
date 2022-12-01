import { Component, OnInit, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { ConfirmationService, MessageService } from "primeng/api";

import { ProductService } from "./product.service";
import { Product } from "./product";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [MessageService],
  styles: [
    `
    :host ::ng-deep .p-cell-editing {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
  `,
  ],
})
export class AppComponent {
  @ViewChild("dt", { static: false }) table: Table;

  products: Product[] = [];
  clonedProducts: { [s: string]: Product } = {};

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productService: ProductService
  ) {
    this.products = [];
  }

  ngOnInit() {
    this.productService
      .getProducts()
      .then((data) => (this.products = data))
      .then((value: Product[]) => {
        this.addEmptyProduct();
      });
  }

  // Insert empty product so the table has an empty form
  addEmptyProduct() {
    this.products.push({isNew: true } as Product);
  }

  onRowAddInit(product: Product, index: number) {

  }

  onRowEditInit(product: Product, index: number) {
    this.clonedProducts[index] = { ...product };
  }

  onRowEditSave(product: Product, index: number, htmlTableRowElement: HTMLTableRowElement) {
    let isNew = product.isNew || false;

    if (!this.isFormValid(product)) {
      return;
    }

    if (isNew) {
      this.productService
        .addProducts([product])
        .then((data) => (this.products = data))
        .then((value: Product[]) => {
          this.addEmptyProduct();
          this.table.saveRowEdit(product, htmlTableRowElement);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Product was added: " + this.products[index].name,
          });
        })
        .catch((error) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "There was a problem adding " + this.products[index].name,
          });
        });
    } else {
      this.productService
        .updateProducts([product])
        .then((data) => (this.products = data))
        .then((value: Product[]) => {
          delete this.clonedProducts[index];
          this.addEmptyProduct();
          this.table.saveRowEdit(product, htmlTableRowElement);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Product was updated: " + this.products[index].name,
          });
        })
        .catch((error) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "There was a problem updating " + this.products[index].name,
          });
        });
    }
  }

  onRowEditCancel(product: Product, index: number) {
    let isNew = product.isNew || false;
    if (isNew) {
      // Reset the new row
      this.products[index] = {isNew: true } as Product;
    } else {
      // Restore edited row with back up copy
      this.products[index] = this.clonedProducts[index];

      //Remove back up copy
      delete this.clonedProducts[index];
    }
  }

  confirmRowDelete(event: Event, index: number) {
    this.confirmationService.confirm({
      target: event.target as HTMLButtonElement,
      message: "Are you sure that you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.productService
          .deleteProducts([this.products[index].id as number])
          .then((data) => (this.products = data))
          .then((value: Product[]) => {
            this.addEmptyProduct();
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Product was deleted",
            });
          })
          .catch((error) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "There was a problem deleting " + this.products[index].name,
            });
          });
      },
    });
  }

  isFormValid(product: Product) {
    let formIsValid = true;

    let name = product.name || "";
    if (!name.length) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Name is required",
      });
      formIsValid = false;
    }

    let state = product.state || "";
    if (!state.length) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "State is required",
      });
      formIsValid = false;
    } else if (state.length != 2) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "State must be 2 chars",
      });
      formIsValid = false;
    }

    let zip = product.zip || "";
    if (!zip.length) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Zip is required",
      });
      formIsValid = false;
    } else if (zip.length != 5) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Zip must be 5 chars",
      });
      formIsValid = false;
    }

    let amount = product.amount || 0;
    if (!(amount > 0)) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Amount must be greater than 0",
      });
      formIsValid = false;
    }

    let qty = product.qty || -1;
    if (!(qty > -1)) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Qty is required",
      });
      formIsValid = false;
    }

    let item = product.item || "";
    if (!item.length) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Item is required",
      });
      formIsValid = false;
    }

    return formIsValid;
  }
}
