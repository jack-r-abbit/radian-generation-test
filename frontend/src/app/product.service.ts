import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Product } from "./product";

@Injectable()
export class ProductService {
  base_url: string = "http://localhost/api/";
  products_url = this.base_url + "products/";

  headerDict = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  requestOptions = {
    headers: new HttpHeaders(this.headerDict),
  };

  constructor(private http: HttpClient) {}

  getProducts(ids: Number[] = []) {
    let queryParams = new HttpParams();

    return this.http
      .get<any>(this.products_url + ids.join(","), { params: queryParams })
      .toPromise()
      .then((res) => <Product[]>res.data)
      .then((data) => {
        return data;
      });
  }

  addProducts(products: Product[] = []) {
    const body = JSON.stringify({ products: products, action: "add" });

    return this.http
      .post<any>(this.products_url, body, this.requestOptions)
      .toPromise()
      .then((res) => <Product[]>res.data)
      .then((data) => {
        return data;
      });
  }

  deleteProducts(ids: number[] = []) {
    const body = JSON.stringify({ ids: ids, action: "delete" });

    return this.http
      .post<any>(this.products_url, body, this.requestOptions)
      .toPromise()
      .then((res) => <Product[]>res.data)
      .then((data) => {
        return data;
      });
  }

  updateProducts(products: Product[] = []) {
    const body = JSON.stringify({ products: products, action: "update" });

    return this.http
      .post<any>(this.products_url, body, this.requestOptions)
      .toPromise()
      .then((res) => <Product[]>res.data)
      .then((data) => {
        return data;
      });
  }
}
