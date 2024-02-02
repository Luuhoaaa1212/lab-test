import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { Category, Color, Size } from '../../interfaces';
import { InputTextModule } from 'primeng/inputtext';
import { ProductService } from '../../service/index.service';
@Component({
  selector: 'app-fillter',
  standalone: true,
  imports: [
    MultiSelectModule,
    SliderModule,
    SelectButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './fillter.component.html',
})
export class FillterComponent implements OnInit {
  constructor(private productService: ProductService) {}
  @Output() dataFillter: EventEmitter<any> = new EventEmitter<any>();
  categories!: Category[];
  sizes!: Size[];
  colors!: Color[];
  value: number = 200;
  valueSeach: string = '';

  stateOptions: any[] = [
    { label: 'New', value: 'New' },
    { label: 'Old', value: 'Old' },
  ];

  valueBtn: string = 'New';

  selectedCategory!: Category[];
  selectedSizes!: Size[];
  selectedColors!: Color[];

  async ngOnInit() {
    try {
      this.categories = await this.productService.getAllBrand();
      this.colors = await this.productService.getAllColor();
      this.sizes = await this.productService.getAllSize();
    } catch (error) {
      console.log(error);
    }
  }
  handleClickFillters() {
    const dataFillter = {
      seachFillter: this.valueSeach,
      categoryFillter: this.selectedCategory || [],
      sizeFillter: this.selectedSizes || [],
      colorFillter: this.selectedColors || [],
      priceFillter: this.value,
      statusFillter: this.valueBtn,
    };
    this.dataFillter.emit(dataFillter);
  }
}
