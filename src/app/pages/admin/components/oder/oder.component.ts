import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { OderService } from '../../../../service/oder.service';
import { OderDetailService } from '../../../../service/oderDetail.service';
import { Oders, OdersDetail } from '../../../../interfaces';
import { ProductService } from '../../../../service/index.service';
import { UserService } from '../../../../service/auth.service';
import { URL_UPLOAD_IMG } from '../../../../constant';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-oder',
  standalone: true,
  imports: [
    ButtonModule,
    TooltipModule,
    CommonModule,
    ToastModule,
    DialogModule,
    RadioButtonModule,
    FormsModule,
    ConfirmDialogModule,
    DropdownModule,
  ],
  templateUrl: './oder.component.html',
  providers: [ConfirmationService, MessageService],
})
export class OderComponent {
  options: any[] | undefined;

  selectOption: any = {};

  visible: boolean = false;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private odersService: OderService,
    private odersDetailService: OderDetailService,
    private productService: ProductService
  ) {}
  user_id: string = '';
  oderDetail_id: OdersDetail[] = [];
  ordersDataAll: Oders[] = [];
  oderDetail: OdersDetail[] = [];
  productAll: any[] = [];
  sizeAll: any[] = [];
  userAll: any[] = [];
  adressAll: any[] = [];
  colorAll: any[] = [];
  brandAll: any[] = [];
  shiperAll: any[] = [];
  shippingsAll: any[] = [];
  oderItem_id: string = '';
  oderItemComplete_id: string = '';
  shipperFinnd: any = {};
  position: string = 'center';

  visibleShipper: boolean = false;
  visibleReasonDetail: boolean = false;
  reasonObject: any = {};
  dataDetails: any[] = [];
  status: number = 0;
  shippersId: string = '';
  totalMoney: number = 0;

  selectShiper: any = null;

  async ngOnInit() {
    this.options = [
      { name: 'All', status: 4 },
      { name: 'Chờ xác nhận', status: 0 },
      { name: 'Đang giao', status: 1 },
      { name: 'Hoàn thành', status: 2 },
      { name: 'Đã hủy', status: 3 },
    ];
    this.selectOption = this.options[0];
    await this.getDataProduct();
    await this.getDataInit();
  }
  async getDataProduct() {
    this.productAll = await this.productService.getAllProduct();
    this.sizeAll = await this.productService.getAllSize();
    this.colorAll = await this.productService.getAllColor();
    this.brandAll = await this.productService.getAllBrand();
    this.userAll = await this.productService.getAllUser();
    this.adressAll = await this.productService.getAllAddress();
  }
  handleApplyFillter() {
    const status = this?.selectOption?.status;
    if (status !== 4) {
      this.ordersDataAll = this.ordersDataAll.filter((order) => {
        this.getOderDetailById(order._id);
        return this.status == status;
      });
      return;
    }
    this.getDataInit();
  }
  async handleAddShipper() {
    const shipper_id = this.selectShiper._id;
    const data1 = {
      oder_id: this.oderItem_id,
      statusNew: 1,
    };
    const data2 = {
      oder_id: this.oderItem_id,
      shipper_id: shipper_id,
    };
    await this.odersDetailService.updateOdersDetailAll(data1).toPromise();
    await this.odersService.addShipping(data2).toPromise();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Xac Nhận đơn hàng thành công',
    });
    setTimeout(() => {
      this.visibleShipper = false;
      this.visible = false;
      this.oderItem_id = '';
    }, 500);
    this.ordersDataAll = [];
    window.location.reload();
  }
  async handleViewReason(id: any) {
    const resCancel = await this.odersService.getCancelById(id).toPromise();
    const res: any = resCancel;
    const reason_id = res?.reason_id;
    const reason_day = this.parseMongoDBDateTime(res?.createdAt);
    const resReason = await this.odersService
      .getReasonlById(reason_id)
      .toPromise();
    const res1: any = resReason;
    const reasonName = res1.name;
    this.reasonObject = { reason_day, reasonName };
    this.visibleReasonDetail = true;
  }
  async handleCompleteAllOder(id: any) {
    const data = {
      oder_id: id,
      statusNew: 2,
    };
    const res = await this.odersDetailService
      .updateOdersDetailAll(data)
      .toPromise();

    this.getDataInit();
  }

  confirmPosition(position: string) {
    this.position = position;
    this.confirmationService.confirm({
      message: 'Xác nhận hoàn thành đơn hàng này ?',
      header: 'Xác nhận hoàn thành',
      icon: 'pi pi-info-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        const data = {
          oder_id: this.oderItemComplete_id,
          statusNew: 2,
        };
        const data1 = {
          oder_id: this.oderItemComplete_id,
        };
        await this.odersDetailService.updateOdersDetailAll(data).toPromise();
        await this.odersDetailService.addComplete(data1).toPromise();

        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Hoàn tất đơn hàng thành công',
        });
        setTimeout(() => {
          this.visible = false;
          this.oderItemComplete_id = '';
        }, 500);
        await this.getDataInit();
      },
      key: 'positionDialog',
    });
  }

  handleComplete(id: string) {
    this.odersDetailService.getCompleteById(id).subscribe((data) => {
      const res: any = data;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Đơn hàng đã được giao thành công vào lúc: ${this.parseMongoDBDateTime(
          res?.createdAt
        )}`,
      });
    });
  }
  handleOderComplete(id: string) {
    this.oderItemComplete_id = id;
    this.confirmPosition('bottom');
  }

  getInfoShipper(id: any, option: string) {
    const shippingFind = this.shippingsAll.find(
      (shipping) => shipping.oder_id == id
    );
    const shipperFind = this.shiperAll.find(
      (shipper) => shipper._id == shippingFind.shipper_id
    );
    if (shipperFind) {
      return shipperFind[option];
    }
    return '';
  }
  showDialogShiper(id: string) {
    this.oderItem_id = id;
    this.visibleShipper = true;
  }

  async getDataInit() {
    try {
      const ordersDataAll: Oders[] = await this.odersService
        .getAllOders()
        .toPromise();
      this.ordersDataAll = [...ordersDataAll];
      this.ordersDataAll = this.handleSortCart(this.ordersDataAll);

      const shipperDataAll: any[] = await this.odersService
        .getAllAshippers()
        .toPromise();
      const shippingDataAll: any[] = await this.odersService
        .getAllShipping()
        .toPromise();
      this.shiperAll = [...shipperDataAll];
      this.shippingsAll = [...shippingDataAll];

      await Promise.all(
        this.ordersDataAll.map(async (order) => {
          const ordersDetailData: OdersDetail[] = await this.odersDetailService
            .getOdersDetailById(order._id)
            .toPromise();
          this.oderDetail = [...this.oderDetail, ...ordersDetailData];
        })
      );
    } catch (err) {
      console.error(err);
    }
  }
  getOderDetailById(oderId: string, option = false): any {
    const arr = this.oderDetail.filter((item) => item.oder_id === oderId);
    if (arr.length > 0) {
      this.dataDetails = arr;
      this.status = arr[0]?.status;
    }
    return null;
  }
  handleSortCart(arr: Oders[]) {
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
  getInformationShippers(oder_id: string, option: string, avt = false) {
    const shippingsFind = this.shippingsAll.find(
      (shipping) => shipping.oder_id == oder_id
    );
    const idShipper = shippingsFind.shipper_id;
    const shippersFind = this.shiperAll.find(
      (shipper) => shipper._id == idShipper
    );
    if (avt) {
      return URL_UPLOAD_IMG + shippersFind?.avt || undefined;
    }
    return shippersFind[option];
  }
  handleDetailOder(id: any) {
    this.odersDetailService.getOdersDetailById(id).subscribe((data) => {
      this.oderDetail_id = [...data];
      this.totalMoney = this.oderDetail_id.reduce((init: any, item: any) => {
        const ship = Boolean(item.type_tranfer) ? 4 : 2;
        return (
          init + this.getPriceCart(item.product_id, false, item.quantity) + ship
        );
      }, 0);
    });

    this.showDialog();
  }

  getImgCart(id: string, option = false) {
    const productFind = this.productAll.find(
      (product: any) => product._id === id
    );
    if (option) {
      return productFind?.name || '';
    }
    return URL_UPLOAD_IMG + productFind?.avt || undefined;
  }
  getImgShippers(avt: string) {
    return URL_UPLOAD_IMG + avt || undefined;
  }
  getTypeTranfer(type: any) {
    const typeB = Boolean(type);
    return typeB ? 'Nhanh ($4)' : 'Tiết Kiệm ($2)';
  }
  getImgUser(id: string, option = false) {
    const userFind = this.userAll.find((user: any) => user._id === id);
    if (option) {
      return userFind?.username || '';
    }
    return URL_UPLOAD_IMG + userFind?.img || undefined;
  }
  getImg(avt: string) {
    return URL_UPLOAD_IMG + avt;
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

  getNameCart(id: string, option = false, quantity = 0, price = false) {
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
      if (quantity !== 0) {
        return Number(productFind.price) * quantity;
      }
      if (price) {
        return Number(productFind.price);
      }
      return productFind?.name || '';
    }
  }
  getTotalCart(id: string, quantity = 0, type: string) {
    const productFind = this.productAll.find(
      (product: any) => product._id === id
    );
    if (productFind) {
      const ship = Boolean(type) ? 4 : 2;
      return Number(productFind.price) * quantity + ship;
    }
    return 0;
  }
  getdetailAdress(id: string) {
    const addresFind = this.adressAll.find(
      (address: any) => address._id === id
    );
    if (addresFind) {
      return `${addresFind?.phone} | ${addresFind?.detail} `;
    }
    return '';
  }

  showDialog() {
    this.visible = true;
  }

  parseMongoDBDateTime(dateTimeString: string): any {
    const dateObject = new Date(dateTimeString);
    const result = {
      year: dateObject.getFullYear(),
      month: dateObject.getMonth() + 1,
      day: dateObject.getDate(),
      hours: dateObject.getHours(),
      minutes: dateObject.getMinutes(),
      seconds: dateObject.getSeconds(),
    };
    return `${result.hours}: ${result.minutes}: ${result.seconds}, ${result.day}/${result.month}/${result.year}`;
  }
}
