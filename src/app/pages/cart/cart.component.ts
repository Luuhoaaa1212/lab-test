import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { Cart, CartRender, Size } from '../../interfaces';
import { Store } from '@ngrx/store';

import { deleteCart, editCart } from '../../reducers/cart.actions';
import { InputNumberModule } from 'primeng/inputnumber';
import { RouterLink, RouterModule } from '@angular/router';
import { ProductService } from '../../service/index.service';
import { URL_UPLOAD_IMG } from '../../constant';
import { CartService } from '../../service/cart.service';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [InputTextModule ,CommonModule,FormsModule,InputNumberModule,RouterLink,RouterModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {

  percent:any = 0;
  price_old:number = 0;
  value1: number = 50;
  value: string | undefined;

  productAll :any[] = [];
  colorAll :any[] = [];
  sizeAll :any[] = [];

  quantity:number = 0;
  subtotal:any = 0;
  total:any = 0;
 

  totalCart: number = 0;
  productCart:Cart[] = [];
  productAllCartRender:CartRender[] = [];
  productAllCartRender1:CartRender[] = [];
  allCart: any = {};
  cartState$: Observable<Cart[]>;

  constructor(private store: Store<{ carts: Cart[] }>,private productService: ProductService,private cart:CartService) {
    this.cartState$ = this.store.select('carts');
  }

  ngOnInit() {
    try {
      this.cartState$.subscribe(async (updatedCartState) => {
        this.productAll = await this.productService.getAllProduct()
        this.sizeAll = await this.productService.getAllSize()
        this.colorAll = await this.productService.getAllColor()
        this.allCart = updatedCartState;
        this.totalCart = this.allCart.quantity
        
        this.productCart = this.allCart.carts
        this.subtotal = await this.productService.getSubTotal(this.productCart)
        
 
          
      });
    } catch (error) {
      console.log(error);
      
    }
    
  }
  handleDeleteCart(id:string,quantity:number){
      this.store.dispatch(deleteCart({id:id, quantity:quantity}));
      this.cart.setCart()
  }
  getImgCart(id:string){
    const productFind = this.productAll.find(product => product._id === id);
    return URL_UPLOAD_IMG + productFind.avt
  }
   getNameCart(id:string){
    const productFind = this.productAll.find(product => product._id === id);
    return productFind.name
  }
   getPriceCart(id:string){
    const productFind = this.productAll.find(product => product._id === id);
    if(productFind.price_old){
      this.percent = ((productFind.price_old - productFind.price) / productFind.price_old * 100).toFixed();
      this.price_old = productFind.price_old
    }else{
      this.percent = 0;
      this.price_old = 0;
    }
    return productFind.price
  }

  getSizeCart(id:string){
    const size = this.sizeAll.find(size => size._id === id)
    return size?.name
  }
   getColorCart(id:string){
    const color = this.colorAll.find(color => color._id === id)
    return color?.name
  }

  handleInputChange(newQuantity: any,id:string) {
    
    const quantity = newQuantity
    this.store.dispatch(editCart({id,quantity}))
    this.cart.setCart()

 
  }
}
