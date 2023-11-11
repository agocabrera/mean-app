import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent {
  addProductForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private dataService: DataService) {
    this.addProductForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(360)]],
      price: [0.01, [Validators.required, Validators.min(0.01), Validators.max(10000)]],
    });
  }

  handlePost() {
    if (this.addProductForm.valid) {
      const formData = this.addProductForm.value;

      this.dataService.postProduct(formData).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        },
      });

      this.addProductForm.reset();
    }
  }
}
