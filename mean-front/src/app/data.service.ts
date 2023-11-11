import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Product from './models/product.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http: HttpClient;
  private uri: string = environment.apiUri;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.uri}/api/products`);
  }

  postProduct(product: Product): Observable<any> {
    return this.http.post(`${this.uri}/api/products`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.uri}/api/products/${id}`);
  }
}
