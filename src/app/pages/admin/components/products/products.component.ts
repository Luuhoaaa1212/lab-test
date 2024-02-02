import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { SizeService } from '../../../../service/size.service';
import { ColorService } from '../../../../service/color.service';
import { BrandService } from '../../../../service/brand.server';
import { ProductService } from '../../../../service/product.service';
import { ProductDetailService } from '../../../../service/productDetail.service';
import { URL_UPLOAD_IMG } from '../../../../constant';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { Utils } from '../../../../interfaces';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  providers: [MessageService,ConfirmationService],
  imports: [
    HttpClientModule,
    TabViewModule,
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    InputTextareaModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  colors: Utils[] = [];
  sizes: Utils[] = [];
  brands: Utils[] = [];
  products: any[] = [];
  productDetail: any = {};

  des: string = '';
  visible: boolean = false;
  visibleDetail: boolean = false;
  isEdit: boolean = false;
  productEdit: any = {};

  headerDialog: string = 'Add New Product';
  btnTextDialog: string = 'Add';

  name: string = '';
  price: string = '';
  price_old: string = '';
  uploadForm?: any;
  uploadFormDes?: any;
  desFileList: any[] = [];

  selectedBrand!: Utils;
  selectedSizes!: Utils[];
  selectedColors!: Utils[];

  formGroup: FormGroup | any;

  constructor(
    private colorService: ColorService,
    private sizeService: SizeService,
    private brandService: BrandService,
    private productService: ProductService,
    private productDetailService: ProductDetailService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
   
  ) {}

  ngOnInit(): void {
    this.colorService.getData().subscribe((data) => {
      this.colors = [...data];
    });
    this.sizeService.getData().subscribe((data) => {
      this.sizes = [...data];
    });
    this.brandService.getData().subscribe((data) => {
      this.brands = [...data];
    });
    this.productService.getData().subscribe((data) => {
      this.products = [...data];
    });

    this.formGroup = new FormGroup({
      selectedCity: new FormControl<City | null>(null),
    });
    this.uploadForm = this.formBuilder.group({
      avt: [''],
    });
    this.uploadFormDes = this.formBuilder.group({
      avtDes: [''],
    });
  }

  handleFileSelect(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.uploadForm?.get('avt')?.setValue(file);
    }
  }
  handleFileSelectDes(event: any) {
    if (event.target.files.length > 0) {
      this.desFileList = Array.from(event.target.files);
    }
  }
  async handleAddProduct() {
    const nameProduct = this?.name;
    const avt = this.uploadForm?.get('avt')?.value;
    const priceProduct = this.price;
    console.log(priceProduct);
    
    const brand_id = this.selectedBrand?._id;
    const color_ids = this.getIdbyItem(this.selectedColors);
    const size_ids = this.getIdbyItem(this.selectedSizes);
    const des = this.des;
    const formData: FormData = new FormData();

    formData.append('name', nameProduct);
    formData.append('brand_id', brand_id);
    formData.append('price', priceProduct);
    formData.append('price_old', this.price_old);
    formData.append('des', des);
    formData.append('sizes', JSON.stringify(size_ids));
    formData.append('colors', JSON.stringify(color_ids));

    if (Object.keys(this.productEdit).length === 0) {
      formData.append('avt', avt);
      try {
        this.productService.postData(formData).subscribe(
          (ress) => {
            const { _id, name } = ress;
            const product_id = _id;
            if (product_id) {
              const formDataDes = new FormData();
              formDataDes.append('id_product', product_id);
              for (let i = 0; i < this.desFileList.length; i++) {
                formDataDes.append('files', this.desFileList[i]);
              }
              try {
                this.productDetailService
                  .postData(formDataDes)
                  .subscribe((res) => {
                    if (res) {
                      setTimeout(() => {
                        this.showToast(`Thêm sản phẩm ${name} thành công`);
                      }, 200);
                      setTimeout(() => {
                        this.productService.getData().subscribe((data) => {
                          this.products = [...data];
                        });
                      }, 500);
                    }
                  });
              } catch (error) {
                console.log(error);
              }
            }
            this.visible = false;
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      const id = this.productEdit._id;
      const avtCore = this.productEdit.avt;
      const imgDesCore = await this.getImgDesById(id);
      const avtUpdate = !avt ? avtCore : avt
      formData.append('avt', avtUpdate);
      try {
        this.productService.putData(formData,id).subscribe(data => {
          console.log(data);
        })
        const formDataDes = new FormData();
        if(this.desFileList.length > 0){
          for (let i = 0; i < this.desFileList.length; i++) {
            formDataDes.append('files', this.desFileList[i]);
          }
        }else{          
          formDataDes.append('files',JSON.stringify(imgDesCore));
        }
        this.productDetailService.putData(formDataDes,id).subscribe(data => {
          if(data){
            if (data) {
              setTimeout(() => {
                this.showToast(`Cập nhật sản phẩm ${nameProduct} thành công`);
              }, 200);
              setTimeout(() => {
                this.productService.getData().subscribe((data) => {
                  this.products = [...data];
                });
              }, 500);
            }
          }
        })
        this.visible = false;
      } catch (error) {
        console.log(error);
      }
      this.setUpAdd();
      this.productEdit = {};
    }
  }
  showToast(content: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail:content,
    });
  }
  getIdbyItem(data: Utils[]) {
    const idList = data.map((item) => item._id);
    return idList;
  }
  getImgByNameImg(name: string) {
    return URL_UPLOAD_IMG + name;
  }
  getImgDesById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.productDetailService.getDataById(id).subscribe(
        (res) => {
          const { imgs } = res;
          resolve([...imgs]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  formatDay(dateString: string) {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${
      day < 10 ? '0' : ''
    }${day}`;
    return formattedDate;
  }
  showDialog() {
    this.setUpAdd();
    this.visible = true;
  }
  getNameBrandById(id: any) {
    const brandFind = this.brands.find((brand) => brand._id === id);
    return brandFind?.name || '';
  }
  getStyleColorById(id: string) {
    const colorFind = this.colors.find((color) => color._id === id);
    return { 'background-color': colorFind?.name };
  }
  getSizeById(id: any) {
    const sizeFind = this.sizes.find((size) => size._id === id);
    return sizeFind?.name || '';
  }
  showDialogDetail(id: any) {
    const findProduct = this.products.find((p) => p._id === id);
    this.productDetailService.getDataById(findProduct._id).subscribe((data) => {
      if (findProduct && data) {
        this.productDetail = {
          avt: findProduct.avt,
          brand: this.getNameBrandById(findProduct.brand_id),
          des: findProduct.des,
          price: findProduct.price,
          price_old: findProduct.price_old,
          imgs: data.imgs,
          colors: findProduct.color_id,
          sizes: findProduct.size_id,
          createAt: findProduct.createdAt,
        };
      }
      this.visibleDetail = true;
    });
  }
  handleEditProduct(product: any) {
    this.showDialog();
    this.productEdit = product;
    this.name = this.productEdit.name;
    this.price = this.productEdit.price;
    this.price_old = this.productEdit.price_old;
    this.des = this.productEdit.des;

    this.selectedBrand = this.getBrandById(this.productEdit.brand_id);
    this.selectedColors = this.getColorById(this.productEdit.color_id);
    this.selectedSizes = this.getSizeByIdUtils(this.productEdit.size_id);
    this.setUpEdit();
  }
  getBrandById(id: any): Utils {
    const brandFind: any = this.brands.find((b) => b._id == id);
    return brandFind;
  }
  getColorById(ids: string[]): Utils[] {
    const colorsFind = this.colors.filter((color) => ids.includes(color._id));
    return colorsFind;
  }
  getSizeByIdUtils(ids: string[]): Utils[] {
    const sizesFind = this.sizes.filter((size) => ids.includes(size._id));
    return sizesFind;
  }
  setUpEdit() {
    this.headerDialog = 'Edit Product';
    this.btnTextDialog = 'Edit';
  }
  setUpAdd() {
    this.headerDialog = 'Add Product';
    this.btnTextDialog = 'Add';
  }

  confirm2(event: Event,id:any,name:string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: `Are you sure you want to delete the ${name} product?`,
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",
        accept: () => {
          this.productService.deleteDatayId(id).subscribe(data => {
            console.log(data);
          });
          this.productDetailService.deleteData(id).subscribe(data => {
            console.log(data);
          });
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: `The product has been successfully deleted` });
          setTimeout(() => {
            this.productService.getData().subscribe((data) => {
              this.products = [...data];
            });
          }, 300);
        },
        
    });
}
}
