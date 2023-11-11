import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import Product from '../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  private dataService: DataService;
  public products: Product[] = [];

  constructor(dataService: DataService) {
    this.dataService = dataService;
  }

  handleDelete(id: string) {
    this.dataService.deleteProduct(id).subscribe({
      next: () => {
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i]._id === id) {
            this.products.splice(i, 1);
            break;
          }
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnInit() {
    this.dataService.getProducts().subscribe((data) => {
      console.log('Fetched product list:', data);
      this.products = data;
    });
  }
}
