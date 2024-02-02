// product.service.ts

import { Injectable } from '@angular/core';
import { ProductDetail, Product } from '../interfaces';
import { ProductService as ProductService1 } from './product.service';
import { SizeService } from './size.service';
import { ColorService } from './color.service';
import { ProductDetailService } from './productDetail.service';
import { BrandService } from './brand.server';
import { UserService } from './auth.service';
import { AddressService } from './address.service';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private products: ProductService1,
    private colors: ColorService,
    private sizes: SizeService,
    private productDetails: ProductDetailService,
    private brands: BrandService,
    private users: UserService,
    private address: AddressService,
  ) {}
  private productAll: Product[] = [];
  convertToDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  async getProductNewArrivals(option: boolean) {
    try {
      const data = await this.products.getData().toPromise();
      this.productAll = data;
      let ProductsAll = data.sort(
        (a: any, b: any) =>
          this.convertToDate(a.createdAt).getTime() -
          this.convertToDate(b.createdAt).getTime()
      );
      if (option) {
        return ProductsAll.slice(4);
      }
      return ProductsAll.slice(0, 4);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  async getAllProduct() {
    try {
      const data = await this.products.getData().toPromise();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  async getAllUser() {
    try {
      const data = await this.users.getAllUsers().toPromise();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }


  async getAllSize() {
    try {
      const sizes = await this.sizes.getData().toPromise();
      return sizes;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllColor() {
    try {
      const colors = await this.colors.getData().toPromise();
      return colors;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllBrand() {
    try {
      const categories = await this.brands.getData().toPromise();
      return categories;
    } catch (error) {
      console.log(error);
    }
  }
  
  async getAllAddress() {
    try {
      const address = await this.address.getAllAddress().toPromise();
   
      
      return address;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllProductDetail() {
    try {
      const productDetails = await this.productDetails.getData().toPromise();
      return productDetails;
    } catch (error) {
      console.log(error);
    }
  }

  getProductBySeach(ProductAll: any, valueSeach: string) {
    if (valueSeach === '') return ProductAll;
    const result = ProductAll.filter((product: any) =>
      product.name.toLocaleLowerCase().includes(valueSeach.toLocaleLowerCase())
    );
    return result;
  }

  getProductByCategory(Products: any[], data: any[]): any {
    if (data.length == 0) return Products;
    const result = Products.filter((product: any) => {
      return data.some((cate: any) => cate._id == product.brand_id);
    });

    return result;
  }

  getProductBySize(data: any[], size: any[]): any {
    if (size.length === 0) return data;
    const result = data.filter((product: any) => {
      return size.some((s: any) => product.size_id.includes(s._id));
    });
    return result;
  }

  getProductByColor(data: any[], color: any[]): any {
    if (color.length === 0) return data;
    const result = data.filter((product: any) => {
      return color.some((c: any) => product.color_id.includes(c._id));
    });
    return result;
  }

  getProductByPrice(data: any[], percent: number): any {
    if (percent === 200) return data;
    const result = data.filter((product: any) => {
      return product.price <= percent;
    });
    return result;
  }

  getProductByStatus(data: any[], status: string): any {
    if (status === 'New') return data;
    const ProductsOld = data.sort(
      (a, b) =>
        this.convertToDate(b.createdAt).getTime() -
        this.convertToDate(a.createdAt).getTime()
    );
    return ProductsOld;
  }

  getProductByfillter(data: any, products: any[]) {
    const {
      seachFillter,
      categoryFillter,
      sizeFillter,
      colorFillter,
      priceFillter,
      statusFillter,
    } = data;
    let ProductFillter: any[] = [];

    try {
      ProductFillter = this.getProductBySeach(products, seachFillter);
      ProductFillter = this.getProductByCategory(
        ProductFillter,
        categoryFillter
      );
      // ProductFillter = this.getProductBySize(ProductFillter, sizeFillter);
      // ProductFillter = this.getProductByColor(ProductFillter, colorFillter);
      // ProductFillter = this.getProductByPrice(ProductFillter, priceFillter);
      // ProductFillter = this.getProductByStatus(ProductFillter, statusFillter);
      return ProductFillter.length == 0 ? [] : ProductFillter;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getTotalPage() {
    let total: number = 0;
    const ProductAll = await this.getProductNewArrivals(true);
    if (ProductAll.length === 0) return total;
    total = ProductAll.length;
    return total;
  }

  async getProductById(id: string, option: boolean, iso = '') {
    try {
      const products = await this.products.getData().toPromise();
      const ProductsAll = products.sort(
        (a: any, b: any) =>
          this.convertToDate(a.createdAt).getTime() -
          this.convertToDate(b.createdAt).getTime()
      );
      const productDetailAll = await this.getAllProductDetail();
      const productFind = ProductsAll.find((p: any) => p._id === id);
      if (iso !== '') {
        return productFind;
      }

      const productDetailFind: any = productDetailAll.find(
        (p: ProductDetail) => p.product_id === id
      );

      if (productFind && productDetailFind) {
        if (option) {
          const { brand_id, _id } = productFind;
          const ProductLikes = this.getProductByIdCategory(brand_id, _id);
          return ProductLikes || [];
        }
        const { imgs } = productDetailFind;
        const { des } = productFind;
        return { ...productFind, imgDes: [...imgs], des };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getSizeById(id: string) {
    const allSize: any[] = await this.getAllSize();
    const sizeFind = allSize.find((size) => size._id === id);
    return sizeFind || undefined;
  }

  async getColorById(id: string) {
    const allColor: any[] = await this.getAllColor();
    const colorFind = allColor.find((color) => color._id === id);
    return colorFind || undefined;
  }

  async getProductByIdCategory(idCate: string, id: string) {
    const products = await this.getAllProduct();
    return (
      products.filter(
        (product: any) => product.brand_id === idCate && product._id !== id
      ) || undefined
    );
  }

  async getProductBTotal() {
    const products = await this.getAllProduct();
    let ProductsAll = products.sort(
      (a: any, b: any) =>
        this.convertToDate(a.created_at).getTime() -
        this.convertToDate(b.created_at).getTime()
    );
    return ProductsAll.slice(0, 8).length || 0;
  }

  async getFistSize(id: string) {
    const products = await this.getAllProduct();
    const productFind = products.find((p: any) => p._id === id);
    return productFind?.size_id[0];
  }

  async getFistColor(id: string) {
    const products = await this.getAllProduct();
    const productFind = products.find((p: any) => p._id === id);
    return productFind?.color_id[0];
  }

  async getAllCartById(data: any) {
    const { idProduct, idColor, idSize, quantity } = data;
    const productFind = await this.getProductById(idProduct, false, 'kk');
    const colorFind = await this.getColorById(idColor);
    const sizeFind = await this.getSizeById(idSize);

    return {
      id: data.id,
      quantity: quantity,
      name: productFind.name,
      price: productFind.price,
      image: productFind.image,
      color: colorFind?.name,
      size: sizeFind?.name,
    };
  }

  async getSubTotal(carts: any[]) {
    try {
      const products = await this.getAllProduct();
      let subtotal: number = 0;
      if (products) {
        products.forEach((product: any) => {
          carts.forEach((cart: any) => {
            if (cart.idProduct === product._id) {
              subtotal += Number(cart.quantity) * Number(product.price);
            }
          });
        });
      }
      console.log(subtotal);
      
      return subtotal;
    } catch (error) {
      return;
    }
  }
}
