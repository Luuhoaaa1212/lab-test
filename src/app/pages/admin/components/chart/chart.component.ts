import { ProductService } from './../../../../service/product.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OderDetailService } from '../../../../service/oderDetail.service';
import { OderService } from '../../../../service/oder.service';
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    ChartModule,
    DialogModule,
    CommonModule,
    FormsModule,
    RadioButtonModule,
    ButtonModule,
  ],
  templateUrl: './chart.component.html',
})
export class ChartComponent implements OnInit {
  data: any;
  options: any;
  data1: any;

  dataOderDetail: any[] = [];
  dataProductAll: any[] = [];
  dataChartRevenue: any[] = [];

  visibleChartOder: boolean = false;
  visibleChartOder1: boolean = false;
  TimeChooser: any = [];
  TimeChooser1: any = [];
  selectTime: any = null;
  selectTime1: any = null;
  labels: any = [];
  labels1: any = [];

  oderCancelAll: any[] = [];
  oderCompleteAll: any[] = [];

  dataChartCompleteAll: any[] = [];
  dataChartCancelAll: any[] = [];

  textTimeInit: string = '';
  textTimeInit1: string = '';

  options1: any;
  constructor(
    private oderDetailService: OderDetailService,
    private productService: ProductService,
    private oderService: OderService
  ) {}

  async ngOnInit() {
    await this.getDataInit();
    this.dataOderDetail = await this.oderDetailService.getDataAll().toPromise();
    this.dataProductAll = await this.productService.getData().toPromise();

    this.TimeChooser = [
      {
        id: 1,
        name: 'Ngày',
      },
      {
        id: 2,
        name: 'Tuần',
      },
    ];
    this.TimeChooser1 = [
      {
        id: 1,
        name: 'Ngày',
      },
      {
        id: 2,
        name: 'Tháng',
      },
    ];
    this.selectTime = this.TimeChooser[0];
    this.selectTime1 = this.TimeChooser1[0];
    this.textTimeInit = this.selectTime.name;
    this.textTimeInit1 = this.selectTime1.name;
    this.labels = this.getPastDaysArray(7);
    this.labels1 = this.getPastDaysArray(7);
    this.dataChartCompleteAll = this.handleDataBylabelsChange(
      this.oderCompleteAll,
      this.labels
    );
    this.dataChartCancelAll = this.handleDataBylabelsChange(
      this.oderCancelAll,
      this.labels
    );
    this.dataChartRevenue = this.getTotalMoneyByDay(this.labels1);

    this.chartOderInit();
  }
  handleChangeTime() {
    this.textTimeInit = this.selectTime.name;
    if (this.selectTime.id == 1) {
      this.labels = this.getPastDaysArray(7);
      this.dataChartCompleteAll = this.handleDataBylabelsChange(
        this.oderCompleteAll,
        this.labels
      );
      this.dataChartCancelAll = this.handleDataBylabelsChange(
        this.oderCancelAll,
        this.labels
      );
    } else {
      this.labels = this.getRecentWeeksArray();
      this.dataChartCompleteAll = this.countOccurrencesInTimeRanges(
        this.labels,
        this.oderCompleteAll
      );
      this.dataChartCancelAll = this.countOccurrencesInTimeRanges(
        this.labels,
        this.oderCancelAll
      );
    }
    this.chartOderInit();
    this.visibleChartOder = false;
  }
  handleChangeTime1() {
    this.textTimeInit1 = this.selectTime1.name;
    if (this.selectTime1.id == 1) {
      this.labels1 = this.getPastDaysArray(7);
      this.dataChartRevenue = this.getTotalMoneyByDay(this.labels1);

    } else {
      this.labels1 = this.getLastSevenMonths();
      this.dataChartRevenue = this.getTotalMoneyByDayMonth(this.labels1)
    }
    this.chartOderInit();
    this.visibleChartOder1 = false;
  }
  handleClickChangeTime() {
    this.visibleChartOder = true;
  }
  handleClickChangeTime1() {
    this.visibleChartOder1 = true;
  }
  handleDataBylabelsChange(arr: any[], labels: string[]) {
    const result = [];
    const occurrences: any = {};

    const objectDates = arr.map((obj) => this.convertDateFormat(obj.createdAt));

    for (let i = 0; i < objectDates.length; i++) {
      let currentDate = objectDates[i];
      occurrences[currentDate] = (occurrences[currentDate] || 0) + 1;
    }

    for (let j = 0; j < labels.length; j++) {
      let currentDateFromArray = labels[j];
      result.push(occurrences[currentDateFromArray] || 0);
    }
    return result;
  }
  getLastSevenMonths() {
    const months = [];
    const currentDate = new Date();
    for (let i = 6; i >= 0; i--) {
      const currentMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const formattedMonth = `${
        this.formatMonth(currentMonth.getMonth() + 1)
      }/${currentMonth.getFullYear()}`;

      months.push(formattedMonth);
    }

    return months.reverse();
  }

  getTotalMoneyByDay(labels:any) {
    let arr: any[] = [];
    let arrReturn: any[] = [];
    labels.forEach((element: any) => {
      let arrnew: any[] = [];
      this.oderCompleteAll.forEach((c: any) => {
        if (element == this.convertDateFormat(c.createdAt)) {
          arrnew.push(c.oder_id);
        }
      });
      arr.push(arrnew);
    });
    arr.forEach((element: any) => {
      let total = 0;
      if (element.length > 0) {
        element.forEach((id: string) => {
          const oderDetalFind = this.dataOderDetail.find(
            (item) => item._id == id
          );
          const product_id = oderDetalFind?.product_id;
          const productFind = this.dataProductAll.find(
            (item) => item._id == product_id
          );
          const quantity = oderDetalFind?.quantity;
          const price = productFind?.price;
          total += quantity * price;
        });
      }
      arrReturn.push(total);
    });
    return arrReturn;
  }
  getTotalMoneyByDayMonth(labels:any){
    let arr: any[] = [];
    let arrReturn: any[] = [];
    labels.forEach((element: any) => {
        let arrnew: any[] = [];
        this.oderCompleteAll.forEach((c: any) => {
            if(this.convertDateFormat(c.createdAt).includes(element)){
                arrnew.push(c.oder_id);
            }
           
          });
          arr.push(arrnew);
    });
    arr.forEach((element: any) => {
        let total = 0;
        if (element.length > 0) {
          element.forEach((id: string) => {
            const oderDetalFind = this.dataOderDetail.find(
              (item) => item._id == id
            );
            const product_id = oderDetalFind?.product_id;
            const productFind = this.dataProductAll.find(
              (item) => item._id == product_id
            );
            const quantity = oderDetalFind?.quantity;
            const price = productFind?.price;
            total += quantity * price;
          });
        }
        arrReturn.push(total);
    });
    return arrReturn;
  }

  chartOderInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const _this = this;
    this.data = {
      labels: _this.labels,
      datasets: [
        {
          label: 'Hoàn tất',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: _this.dataChartCompleteAll,
        },
        {
          label: 'Đã hủy',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: _this.dataChartCancelAll,
        },
      ],
    };
    this.data1 = {
      labels: _this.labels1,
      datasets: [
        {
          label: 'Doanh Thu ($)',
          backgroundColor: documentStyle.getPropertyValue('--red-500'),
          borderColor: documentStyle.getPropertyValue('--red-500'),
          data: _this.dataChartRevenue,
        },
      ],
    };
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
    this.options1 = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  getPastDaysArray(numberOfDays: number) {
    var currentDate = new Date();

    var pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate());

    var pastDaysArray = [];

    for (var i = 0; i < numberOfDays; i++) {
      pastDaysArray.push(this.formatDate(pastDate));
      pastDate.setDate(pastDate.getDate() - 1);
    }

    return pastDaysArray;
  }
  async getDataInit() {
    const oderCompletes = await this.oderDetailService
      .getAllComplete()
      .toPromise();
    const oderCancels = await this.oderService.getAllCancel().toPromise();
    const res1: any = oderCompletes;
    const res2: any = oderCancels;
    this.oderCompleteAll = [...res1];
    this.oderCancelAll = [...res2];
  }
   formatMonth(month:number) {
    return month < 10 ? `0${month}` : `${month}`;
  }
  

  getRecentWeeksArray() {
    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    var recentWeeksArray = [];

    for (var i = 0; i < 7; i++) {
      var startOfWeek = new Date(currentDate);
      startOfWeek.setDate(
        currentDate.getDate() - currentDate.getDay() - i * 7 + 1
      );
      var endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      if (i === 6 && endOfWeek > currentDate) {
        endOfWeek = currentDate;
      }
      var weekString =
        this.formatDate(startOfWeek) + ' - ' + this.formatDate(endOfWeek);
      recentWeeksArray.push(weekString);
    }

    return recentWeeksArray;
  }
  formatDate(date: any) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return day + '/' + month + '/' + year;
  }
  convertDateFormat(inputDate: string): string {
    let date = new Date(inputDate);

    let day: number | string = date.getDate();
    let month: number | string = date.getMonth() + 1;
    let year = date.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return `${day}/${month}/${year}`;
  }

  countOccurrencesInTimeRanges(dateArray: any, objectArray: any) {
    var result = [];

    for (var i = 0; i < dateArray.length; i++) {
      var dateRange = this.parseDateRange(dateArray[i]);

      var count = this.countOccurrencesInDateRange(dateRange, objectArray);

      result.push(count);
    }

    return result;
  }

  parseDateRange(dateRangeString: any) {
    var dates = dateRangeString.split('-');

    var startDate = this.parseDateString(dates[0].trim());
    var endDate = this.parseDateString(dates[1].trim());

    return { start: startDate, end: endDate };
  }

  parseDateString(dateString: any) {
    var parts = dateString.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    return new Date(year, month - 1, day);
  }

  countOccurrencesInDateRange(dateRange: any, objectArray: any) {
    var count = 0;

    for (var j = 0; j < objectArray.length; j++) {
      var createdAt = new Date(objectArray[j].createdAt);

      if (createdAt >= dateRange.start && createdAt <= dateRange.end) {
        count++;
      }
    }
    return count;
  }
}
