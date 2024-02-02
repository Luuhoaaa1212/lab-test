import { Component, OnInit } from '@angular/core';
import { SliderComponent } from '../../components/slider/slider.component';
import { ArrivalsComponent } from '../../components/arrivals/arrivals.component';
import { BrandsComponent } from '../../components/brands/brands.component';
import { FillterComponent } from '../../components/fillter/fillter.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import {
  Category,
  Color,
  Product,
  ProductDetail,
  Size,
} from '../../interfaces';

import { CarouselModule } from 'primeng/carousel';
import { ProductService } from '../../service/index.service';
import { URL_UPLOAD_IMG } from '../../constant';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SliderComponent,
    BrandsComponent,
    ArrivalsComponent,
    FillterComponent,
    PaginationComponent,
    CarouselModule,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  totalItem: number = 0;
  row: number = 8;
  currentPage: number = 1;

  products: any = [];
  productsAll: any = [];
  productsCoppy: Product[] = [];
  productDtail: ProductDetail[] = [];
  topProducts: Product[] = [];
  sizes: Size[] = [];
  colors: Color[] = [];
  categoris: Category[] = [];

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    try {
      this.categoris = await this.productService.getAllBrand();
      this.productDtail = await this.productService.getAllProductDetail();

      this.sizes = await this.productService.getAllSize();
      this.colors = await this.productService.getAllColor();

      this.topProducts = await this.productService.getProductNewArrivals(false);

      this.products = await this.productService.getProductNewArrivals(true);
      this.productsAll = await this.productService.getProductNewArrivals(true);
    
 
      this.productsCoppy = await this.productService.getProductNewArrivals(
        true
      );

      this.totalItem = await this.productService.getTotalPage();
      this.handlePagination();
    } catch (error) {
      console.log(error);
    }
  }
  getImgByNameImg(name: string) {
    return URL_UPLOAD_IMG + name;
  }
  handleFillterData(data: any) {
    this.products = this.productService.getProductByfillter(data,this.productsAll);
    this.productsCoppy = this.products;
  }
  handlePagination() {
    const startIndex = (this.currentPage - 1) * this.row;
    const endIndex = startIndex + this.row;
    this.products = this.productsCoppy.slice(startIndex, endIndex);
  }
  handleUpdatePagination(event: any) {
    this.currentPage = event.page + 1;
    this.row = event.rows;
    const startIndex = (this.currentPage - 1) * this.row;
    const endIndex = startIndex + this.row;

    this.products = this.productsCoppy.slice(startIndex, endIndex);
  }
}
