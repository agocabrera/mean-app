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
  public loadingData!: boolean;
  public loadingMessage: string = 'Loading';
  private dotsRemaining: number = 3;
  private intervalId: any;
  public products: Product[] = [];

  constructor(dataService: DataService) {
    this.dataService = dataService;
  }

  handleDelete(id: string): void {
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

  animateLoading(): void {
    this.loadingMessage = this.loadingMessage + '.';
    this.dotsRemaining--;
    if (this.dotsRemaining < 0) {
      this.loadingMessage = 'Loading';
      this.dotsRemaining = 3;
    }
  }

  ngOnInit() {
    this.loadingData = true;
    this.intervalId = setInterval(() => {
      this.animateLoading();
    }, 200);
    this.dataService.getProducts().subscribe((data) => {
      console.log('Fetched product list:', data);
      this.products = data;
      this.loadingData = false;
      clearInterval(this.intervalId);
    });
  }
}
