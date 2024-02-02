import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, OnInit, inject } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Cart, Product, ProductDetail } from '../../interfaces';

import { SizeService } from '../../service/injectable/size';
import { ColorService } from '../../service/injectable/color';
import { FormControl, FormsModule } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { addCart } from '../../reducers/cart.actions';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { InputNumberModule } from 'primeng/inputnumber';
import { ProductService } from '../../service/index.service';
import { URL_UPLOAD_IMG } from '../../constant';
@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    RouterLink,
    ToastModule,
    ButtonModule,
    InputNumberModule,
  ],
  templateUrl: './detail.component.html',
  providers: [MessageService],
})
export class DetailComponent implements OnInit {
  colorAll:any = [];
  sizeAll:any = [];


  productId: string = '';
  quantity: number = 1;
  productsLikes: Product[] = [];
  product: any = [];
  cartAll: any = {};
  cartState$: Observable<Cart[]>;
  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private sizeService: SizeService,
    private colorService: ColorService,
    private store: Store<{ carts: Cart[] }>,
    private productService: ProductService
  ) {
    this.cartState$ = this.store.select('carts');
  }
  ngOnInit(): void {
    try {
      this.route.params.subscribe(async (params) => {
        this.productId = params['id'];

        this.colorService.setColorId(
          await this.productService.getFistColor(this.productId)
        );
        this.sizeService.setSizeId(
          await this.productService.getFistSize(this.productId)
        );
        this.product = await this.productService.getProductById(
          this.productId,
          false
        );
        console.log(this.product);
        
        this.colorAll = await this.productService.getAllColor();
        this.sizeAll = await this.productService.getAllSize();
      
 
        this.productsLikes = await this.productService.getProductById(
          this.productId,
          true
        );
      });
    } catch (error) {
      console.log(error);
    }
  }
  getImgByNameImg(name: string) {
    return URL_UPLOAD_IMG + name;
  }
  getPerentProduct(price_old: number, price_new: number) {
    const percent = ((price_old - price_new) / price_old) * 100;
    return percent.toFixed();
  }
  getNameColorById(id: string) {
    const sizeFind = this.colorAll.find((color:any) => color._id === id);
    return sizeFind?.name || '';
  }
  getNameSizeById(id: string) {
    const sizeFind = this.sizeAll.find((size:any) => size._id === id);
    return sizeFind?.name || '';
  }
  handleChageColor(id: string): void {
    this.colorService.setColorId(id);
  }
  handleChageSize(id: string) {
    this.sizeService.setSizeId(id);
  }
  getStyleSize(index: number, id: string): object {
    let background;
    let color;
    const storedColorId = this.sizeService.getSizeId();
    if (storedColorId === id) {
      background = 'black';
      color = 'white';
    } else {
      background = storedColorId === '' && index === 0 ? 'black' : '#F0F0F0';
      color = storedColorId === '' && index === 0 ? 'white' : 'black';
    }
    return {
      background: background,
      color: color,
      padding: '12px 24px',
      'border-radius': '62px',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      cursor: 'pointer',
    };
  }
  getStyleColor(id: string, index: number) {
    let html: string;
    html =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14.5306 5.03063L6.5306 13.0306C6.46092 13.1005 6.37813 13.156 6.28696 13.1939C6.1958 13.2317 6.09806 13.2512 5.99935 13.2512C5.90064 13.2512 5.8029 13.2317 5.71173 13.1939C5.62057 13.156 5.53778 13.1005 5.4681 13.0306L1.9681 9.53063C1.89833 9.46087 1.84299 9.37804 1.80524 9.28689C1.76748 9.19574 1.74805 9.09804 1.74805 8.99938C1.74805 8.90072 1.76748 8.80302 1.80524 8.71187C1.84299 8.62072 1.89833 8.53789 1.9681 8.46813C2.03786 8.39837 2.12069 8.34302 2.21184 8.30527C2.30299 8.26751 2.40069 8.24808 2.49935 8.24808C2.59801 8.24808 2.69571 8.26751 2.78686 8.30527C2.87801 8.34302 2.96083 8.39837 3.0306 8.46813L5.99997 11.4375L13.4693 3.96938C13.6102 3.82848 13.8013 3.74933 14.0006 3.74933C14.1999 3.74933 14.391 3.82848 14.5318 3.96938C14.6727 4.11028 14.7519 4.30137 14.7519 4.50063C14.7519 4.69989 14.6727 4.89098 14.5318 5.03188L14.5306 5.03063Z" fill="white"/></svg>';
    const storedColorId = this.colorService.getColorId();
    const parents = document.querySelectorAll('.rootColors') as NodeList;
    if (storedColorId === id) {
      parents.forEach((node: any) => {
        const el = node.querySelector('svg');
        if (el) {
          node.removeChild(el);
        }
      });

      const rootColor = document.getElementById(
        `rootColor-${id}`
      ) as HTMLElement;
      rootColor.innerHTML = html;
      return;
    } else {
      if (storedColorId === '' && index === 0) {
        const rootColor = parents[0] as HTMLElement;
        rootColor.innerHTML = html;
        return;
      }
    }
    return null;
  }
  handleAddCart() {
    const idProduct = this.productId;
    const quantity = this.quantity;
    const idColor = this.colorService.getColorId();
    const idSize = this.sizeService.getSizeId();
    const cart: any = {
      id: uuidv4(),
      idProduct: idProduct,
      idColor: idColor,
      idSize: idSize,
      quantity: quantity,
    };

    this.store.dispatch(addCart({ cart: cart }));
    this.show({
      severity: 'success',
      summary: 'Thành Công',
      detail: `Thêm thành công sản phẩm ${this.product.name} vào giỏ hàng`,
    });
    this.cartState$.subscribe((updatedCartState) => {
      this.cartAll = updatedCartState;
      localStorage.setItem('carts', JSON.stringify(this.cartAll));
    });
  }
  show(message: object) {
    this.messageService.add(message);
  }
}
