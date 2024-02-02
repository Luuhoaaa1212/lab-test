import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { UserService } from '../../service/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { AddressService } from '../../service/address.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Address, Cart } from '../../interfaces';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ProductService } from '../../service/index.service';
import { URL_UPLOAD_IMG } from '../../constant';
import { OderService } from '../../service/oder.service';
import { OderDetailService } from '../../service/oderDetail.service';
import { Router } from '@angular/router';
interface City {
  name: string;
  code: string;
  type?:boolean
}
interface Tranfer {
  id: string;
  name: string;
  day: string;
  type: boolean;
  price?: number;
}
@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    InputTextareaModule,
    OverlayPanelModule,
    DropdownModule,
    CheckboxModule,
    ToastModule,
    RadioButtonModule,
  ],
  templateUrl: './pay.component.html',
  providers: [MessageService],
})
export class PayComponent implements OnInit, AfterContentInit {
  userNameInit: string = '';
  phoneNumerInit: string = '';
  addressDetailInit: string = '';

  user_id: string | undefined = '';
  cart_id: string | undefined = '';
  userName: string = '';
  phoneNumer: string | undefined = '';
  addressDetail: string = '';

  value3: string | undefined = '';
  visible: boolean = false;
  visible1: boolean = false;
  visibleTranfer: boolean = false;

  totalMoney: number = 0;
  totalShip: number = 0;
  totalVoucher: number = 0;
  totalPay: number = 0;

  cities: City[] | undefined;
  tranfers: Tranfer[] | undefined;
  selecttranfers: Tranfer | undefined;

  selectedCity: City | undefined;

  selectedAddress: any = null;
  addressDefaultInit: any = null;
  selectedDefault: any = null;

  productAll: any = [];
  sizeAll: any = [];
  colorAll: any = [];
  brandAll: any = [];
  percent: any = 0;
  price_old: number = 0;
  shipMoney: number = 2;

  addressArr: Address[] = [];

  cartState$: Observable<Cart[]>;

  productCart: Cart[] = [];
  allCart: any = {};
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private addressService: AddressService,
    private store: Store<{ carts: Cart[] }>,
    private productService: ProductService,
    private oderService: OderService,
    private oderDetalService: OderDetailService,
    private router: Router
  ) {
    this.cartState$ = this.store.select('carts');
  }
  ngAfterContentInit(): void {}

  ngOnInit() {
    this.cities = [
      { name: 'Thanh toán khi nhận hàng', code: 'NY',type:false },
      { name: 'Thanh toán trực tuyến', code: 'RM',type:true },
    ];
    this.tranfers = [
      {
        id: '1',
        name: 'Nhanh',
        day: this.getDayOrerDelively(true),
        type: true,
        price:4,
      },
      {
        id: '2',
        name: 'Tiết kiệm',
        day: this.getDayOrerDelively(),
        type: false,
        price:2,
      },
    ];
    this.selecttranfers = this.tranfers[0];
    this.getUserInit();
    this.getCartInit();
  }
  getTotalInit() {
    let total = 0;
    let totalMoney = 0;
    this.productCart.forEach((cart: Cart) => {
      totalMoney += this.getPriceTotalCart(cart.idProduct, cart.quantity);
      total += cart.typetranfer.price;
    });
    this.totalShip = total;
    this.totalMoney = totalMoney;
    this.totalPay = this.totalMoney + this.totalShip + this.totalVoucher;
  }

  getUserInit() {
    this.userService.getUser().subscribe(
      (user) => {
        
        
        this.user_id = user._id;
        this.addressService.getDataById(user._id).subscribe((data) => {

          if(!data.error){
            this.addressArr = data;
            let addressDefault = this.addressArr.find(
              (address) => address.default
            );
            if (!addressDefault) {
              addressDefault = this.addressArr[0];
              addressDefault.default = false;
            }
            this.selectedAddress = addressDefault;
            this.selectedDefault = addressDefault;
            this.addressDefaultInit = addressDefault;
          }
        },
          (error) =>{
            console.log(error);
            
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getCartInit() {
    this.cartState$.subscribe(async (updatedCartState) => {
      this.productAll = await this.productService.getAllProduct();
      this.sizeAll = await this.productService.getAllSize();
      this.colorAll = await this.productService.getAllColor();
      this.brandAll = await this.productService.getAllBrand();

      this.allCart = updatedCartState;
      this.productCart = this.allCart.carts;
      this.handleAddTypefer();
      this.getTotalInit();
    });
  }
  handleAddTypefer() {
    this.productCart = this.productCart.map((cart) => {
      const typetranfer = this.selecttranfers;
      return { ...cart, typetranfer };
    });
  }
  handleChangeTranfer() {
    this.productCart = this.productCart.map((cart) => {
      const typetranfer = this.selecttranfers;
      if (cart.id === this.cart_id) {
        return { ...cart, typetranfer };
      }
      return cart;
    });
    this.getTotalInit()
    this.visibleTranfer = false;
  }
  showDialogTranfer(id: any) {
    this.visibleTranfer = true;
    this.cart_id = id;
  }
  getImgCart(id: string) {
    const productFind = this.productAll.find(
      (product: any) => product._id === id
    );
    return URL_UPLOAD_IMG + productFind?.avt || undefined;
  }
  handleChangeAddress() {
    if (this.addressDefaultInit._id !== this.selectedDefault._id) {
      this.addressService.putData(this.selectedDefault._id).subscribe(
        (data) => {
          this.getUserInit();
        },
        (error) => {
          console.log(error);
        }
      );
    }
    this.visible = false;
  }

  handleAddNewAddress() {
    const data = {
      username: this.userName,
      phone: this.phoneNumer,
      detail: this.addressDetail,
      user_id: this.user_id,
    };
    this.addressService.postData(data).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Add new address successfully',
        });
        if(this.addressArr.length == 0){
          this.selectedAddress = data
        }
        this.getUserInit();
        setTimeout(() => {
          this.visible1 = false;
          this.userName = '';
          this.addressDetail = '';
          this.phoneNumer = '';
        }, 700);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error server',
        });
      }
    );
  }
  handleODder() {
    const type_pay: boolean = Boolean(this?.selectedCity?.type);
    const user_id = this.user_id;
    const address_id = this.selectedAddress._id;
    
    const data = {
      address_id,
      user_id,
      type_pay,
    };
    this.oderService.postData(data).subscribe(
      (data) => {
        const oder_id = data;
        this.productCart.forEach((cart) => {
          const data = {
            oder_id,
            product_id: cart.idProduct,
            quantity: cart.quantity,
            color_id: cart.idColor,
            size_id: cart.idSize,
            type_tranfer: cart.typetranfer.type,
            status: 0,
          };
          this.oderDetalService.postData(data).subscribe(
            (data) => {},
            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Lỗi hệ thống vui lòng thử lại !',
              });
            }
          );
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Đơn hàng đã được đặt thành công !',
        });
        setTimeout(() => {
          this.router.navigate(['user/purchase']);
        }, 800);
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Lỗi hệ thống vui lòng thử lại !',
        });
      }
    );
  }

  getNameCart(id: string, option = false) {
    const productFind = this.productAll.find(
      (product: any) => product._id === id
    );
    if (productFind) {
      if (option) {
        const brandFind = this.brandAll.find(
          (brand: any) => brand._id === productFind.brand_id
        );
        return brandFind?.name || '';
      }
      return productFind?.name || '';
    }
  }

  getPriceCart(id: string) {
    const productFind = this.productAll.find(
      (product: any) => product._id === id
    );

    return productFind?.price || 0;
  }

  getPriceTotalCart(id: string, quantity: number, option = false) {
    const productFind = this.productAll.find(
      (product: any) => product._id === id
    );
    let total;
    if (option) {
      total = Number(productFind?.price) * Number(quantity) + this.shipMoney;
    } else {
      total = Number(productFind?.price) * Number(quantity);
    }
    return total || 0;
  }

  getSizeCart(id: string) {
    const size = this.sizeAll.find((size: any) => size._id === id);
    return size?.name || '';
  }
  getColorCart(id: string) {
    const color = this.colorAll.find((color: any) => color._id === id);
    return color?.name || '';
  }
  
  

 

  showDialog() {
    this.visible = true;
  }

  showDialog1() {
    this.visible1 = true;
    
  }

  getNextTwoDays(option = false): { dayAfterNext: string } {
    const currentDate = new Date();
    const daysToAdd = option ? 2 : 4;

    const targetDate = new Date(currentDate);
    targetDate.setDate(currentDate.getDate() + daysToAdd);

    const formatOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    return {
      dayAfterNext: targetDate.toLocaleDateString(undefined, formatOptions),
    };
  }

  getDayOrerDelively(option = false) {
    let result;
    if (option) {
      result = this.getNextTwoDays(option);
    } else {
      result = this.getNextTwoDays();
    }
    return result.dayAfterNext;
  }
}
