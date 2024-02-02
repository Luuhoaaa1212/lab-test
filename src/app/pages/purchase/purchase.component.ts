import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { UserService } from '../../service/auth.service';
import { OderService } from '../../service/oder.service';
import { OderDetailService } from '../../service/oderDetail.service';
import { Observable, map, switchMap } from 'rxjs';
import { Oders, OdersDetail, Reasons } from '../../interfaces';
import { ProductService } from '../../service/index.service';
import { URL_UPLOAD_IMG } from '../../constant';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [
    RouterLink,
    TabViewModule,
    ToastModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    DialogModule,
    RadioButtonModule,
    StepsModule,
  ],
  templateUrl: './purchase.component.html',
  providers: [MessageService],
})
export class PurchaseComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private odersService: OderService,
    private odersDetailService: OderDetailService,
    private productService: ProductService
  ) {}
  user_id: string = '';
  oderData: any[] = [];
  oderDetail: OdersDetail[] = [];
  oderDetailloading: OdersDetail[] = [];
  oderDetailShipping: OdersDetail[] = [];
  oderDetailComplete: OdersDetail[] = [];
  oderDetailCancel: OdersDetail[] = [];
  productAll: any[] = [];
  sizeAll: any[] = [];
  colorAll: any[] = [];
  brandAll: any[] = [];
  reasonAll: any[] = [];
  shippersAll: any[] = [];
  oderItem_id: string = '';
  completeAll: any[] = [];

  reasonDetail: any = {};

  visibleReason: boolean = false;
  visibleReasonDetail: boolean = false;
  visibleShipping: boolean = false;
  selectReason: any = {};

  items: MenuItem[] | undefined;
  activeIndexShipping: number = 2;
  oderItem_shipping_id: string = '';
  oderItem_complete_id: string = '';
  type_tranfer: string = 'Nhanh';

  dataDetails: any[] = [];
  status: any = null;
  time: any = null;

  async ngOnInit() {
    await this.getDataProduct();
    await this.getDataInit();
  }
  async getDataProduct() {
    this.productAll = await this.productService.getAllProduct();
    this.sizeAll = await this.productService.getAllSize();
    this.colorAll = await this.productService.getAllColor();
    this.brandAll = await this.productService.getAllBrand();
    this.completeAll = await this.odersDetailService
      .getAllComplete()
      .toPromise();
  }
  showDialogReason(id: any) {
    this.oderItem_id = id;
    this.visibleReason = true;
  }
  async showDialogReasonDetail(id: string) {
    const resCancel = await this.odersService.getCancelById(id).toPromise();
    const res: Reasons = resCancel as Reasons;
    const resReason = await this.odersService
      .getReasonlById(res?.reason_id)
      .toPromise();
    const res2: any = resReason as any;
    this.reasonDetail = {
      oder_id: res.oder_id,
      createdAt: res.createdAt,
      name: res2.name,
    };

    this.visibleReasonDetail = true;
  }
  async handleViewShipping(id: any, option: boolean) {
    const resShipping = await this.odersService.getShippingById(id).toPromise();
    const res1: any = resShipping as any;
    const shippers_id = res1.shipper_id;
    const oders_id = res1.oder_id;

    const orderDataFind = this.oderData.find(item =>item._id = id)
    const resShippers = await this.odersService
      .getshippersById(shippers_id)
      .toPromise();
    const typeTranfer = orderDataFind.type_tranfer;
    this.type_tranfer = typeTranfer;
    const oder_day = this.parseMongoDBDateTime(orderDataFind.createdAt);
    const oder_confirm = this.parseMongoDBDateTime(res1.createdAt);
    const nameShipper = resShippers.name;

    if (option) {
      this.activeIndexShipping = 2;
      const deliveryTime = this.parseMongoDBDateTime2(
        orderDataFind.createdAt,
        typeTranfer
      );
      const newItem = [
        {
          label: `Thời gian đặt hàng vào lúc: ${oder_day}`,
        },
        {
          label: `Đã xác nhận vào : ${oder_confirm}`,
        },
        {
          label: `Đang vận chuyển bởi: ${nameShipper}`,
        },
        {
          label: `Dự kiến hoàn thành: ${deliveryTime}`,
        },
      ];
      this.items = [...newItem];
    } else {
      this.activeIndexShipping = 3;
      const completeRes = await this.odersDetailService
        .getCompleteById(id)
        .toPromise();
      const res2: any = completeRes;
      const deliveryTime = this.parseMongoDBDateTime(res2.createdAt);
      const newItem = [
        {
          label: `Thời gian đặt hàng vào lúc: ${oder_day}`,
        },
        {
          label: `Đã xác nhận vào : ${oder_confirm}`,
        },
        {
          label: `Được vận chuyển bởi: ${nameShipper}`,
        },
        {
          label: `Đã hoàn thành lúc: ${deliveryTime}`,
        },
      ];
      this.items = [...newItem];
    }

    this.visibleShipping = true;
  }

  getOderDetailById(oderId: string, option = false): any {
    const arr = this.oderDetail.filter((item) => item.oder_id === oderId);
    if (option) {
      return arr;
    }
    this.dataDetails = arr;
    this.status = arr[0]?.status;
    this.time = arr[0]?.createdAt;
    return null;
  }
 
  async handleChangeReason() {
    const reason_id = this.selectReason._id;
    const oder_id = this.oderItem_id;
    const data1 = {
      oder_id: oder_id,
      statusNew: 3,
    };
    const data2 = {
      oder_id: oder_id,
      reason_id: reason_id,
    };
    try {
      await this.odersDetailService.updateOdersDetailAll(data1).toPromise();
      await this.odersService.addCancel(data2).toPromise();
    } catch (error) {
      console.log(error);
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Hủy đơn hàng thành công',
    });
    setTimeout(() => {
      this.visibleReason = false;
      this.oderItem_id = '';
    }, 500);
    this.oderDetail = [];
    await this.getDataInit();
  }
  getTimeComplete(id: string) {
    const completeFind = this.completeAll.find(
      (complete) => complete.oder_id == id
    );

    return this.parseMongoDBDateTime(completeFind?.createdAt);
  }
  async getDataInit() {
    try {
      const userData = await this.userService.getUser().toPromise();
      this.user_id = userData._id;

      const ordersData: Oders[] = await this.odersService
        .getOdersById(userData._id)
        .toPromise();
      const reasons = await this.odersService.getAllReasons().toPromise();
      this.reasonAll = [...reasons];

      await Promise.all(
        ordersData.map(async (order) => {
          const ordersDetailData: OdersDetail[] = await this.odersDetailService
            .getOdersDetailById(order._id)
            .toPromise();
          this.oderDetail = [...this.oderDetail, ...ordersDetailData];

          this.oderDetail = this.handleSortCart(this.oderDetail);
        })
      );
      this.oderData = ordersData;

      this.oderDetailloading = this.handleSortShippingCart(this.oderDetail, 0);
      this.oderDetailShipping = this.handleSortShippingCart(this.oderDetail, 1);
      this.oderDetailComplete = this.handleSortShippingCart(this.oderDetail, 2);
      this.oderDetailCancel = this.handleSortShippingCart(this.oderDetail, 3);
    } catch (err) {
      console.error(err);
    }
  }
  getPriceTotal(oder_id: string) {
    const arr = this.getOderDetailById(oder_id, true);
    let total = 0;
    arr.forEach((element: any) => {
      total += this.getPriceCart(element.product_id, false, element.quantity);
    });
    return total;
  }
  handleSortCart(arr: OdersDetail[]) {
    arr.sort(function (a, b) {
      let timeA = Math.max(
        new Date(a.createdAt).getTime(),
        new Date(a.updatedAt).getTime()
      );
      let timeB = Math.max(
        new Date(b.createdAt).getTime(),
        new Date(b.updatedAt).getTime()
      );

      return timeB - timeA;
    });

    return arr;
  }
  handleSortShippingCart(arr: OdersDetail[], status: number): OdersDetail[] {
    arr = arr.filter((oder) => oder.status == status);

    return arr;
  }

  getImgCart(id: string) {
    const productFind = this.productAll.find(
      (product: any) => product._id === id
    );
    return URL_UPLOAD_IMG + productFind?.avt || undefined;
  }
  getSizeCart(id: string) {
    const size = this.sizeAll.find((size: any) => size._id === id);
    return size?.name || '';
  }
  getColorCart(id: string) {
    const color = this.colorAll.find((color: any) => color._id === id);
    return color?.name || '';
  }
  getPriceCart(id: string, option = false, quantity = 0) {
    const productFind = this.productAll.find(
      (product: any) => product._id === id
    );
    if (option) {
      return productFind?.price_old || 0;
    }
    if (quantity !== 0) {
      return Number(productFind?.price) * quantity;
    }
    return productFind?.price || 0;
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
  parseMongoDBDateTime(dateTimeString: string): any {
    if (dateTimeString) {
      const dateObject = new Date(dateTimeString);
      const result = {
        year: dateObject.getFullYear(),
        month: dateObject.getMonth() + 1,
        day: dateObject.getDate(),
        hours: dateObject.getHours(),
        minutes: dateObject.getMinutes(),
        seconds: dateObject.getSeconds(),
      };

      const resultReturn = `${result.hours}: ${result.minutes}: ${result.seconds}, ${result.day}/${result.month}/${result.year}`;

      return resultReturn;
    }
  }
  parseMongoDBDateTime2(dateTimeString: any, isNext: any) {
    const dateObject = new Date(dateTimeString);
    const daysToAdd = Boolean(isNext) ? 2 : 4;
    dateObject.setDate(dateObject.getDate() + daysToAdd);
    const result = {
      year: dateObject.getFullYear(),
      month: dateObject.getMonth() + 1,
      day: dateObject.getDate(),
      hours: dateObject.getHours(),
      minutes: dateObject.getMinutes(),
      seconds: dateObject.getSeconds(),
    };
    const mn = result.minutes <= 9 ? `0${result.minutes}` : result.minutes;
    return `${result.hours}:${mn}:${result.seconds}, ${result.day}/${result.month}/${result.year}`;
  }
}
