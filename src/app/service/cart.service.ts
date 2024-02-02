import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getUrlBaseApi } from '../constant';
import { Store } from '@ngrx/store';
import { Cart } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartState$: Observable<Cart[]>;

  constructor(private store: Store<{ carts: Cart[] }>) {
    this.cartState$ = this.store.select('carts');
  }
  setCart(){
    try {
      this.cartState$.subscribe(async (updatedCartState) => {
        localStorage.setItem('carts', JSON.stringify(updatedCartState))
      });
    } catch (error) {
      console.log(error);
  
    }
  }
 
}