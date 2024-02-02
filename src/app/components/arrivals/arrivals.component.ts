import { Component, Input } from '@angular/core';
import { Product } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { URL_UPLOAD_IMG } from '../../constant';

@Component({
  selector: 'app-arrivals',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterModule],
  templateUrl: './arrivals.component.html',
})
export class ArrivalsComponent {
  @Input() title: string = '';
  @Input() products: Product[] = [];
  getStar(starNumber: number) {
    return `<div> class="tw-overflow-hidden tw-w-[${(starNumber * 100) / 5}px]"`
  }
  getPerentProduct(price_old:number, price_new:number) {
    const percent = (price_old - price_new) / price_old * 100 ;
    return percent.toFixed();
  }
  getImgByNameImg(name: string) {
    return URL_UPLOAD_IMG + name;
  }
}
