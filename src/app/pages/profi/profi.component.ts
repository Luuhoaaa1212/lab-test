import { AfterContentInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import $ from 'jquery';
import axios from 'axios';
import { FormsModule } from '@angular/forms';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-profi',
  standalone: true,
  imports: [RouterLink,TabViewModule,ButtonModule,DialogModule,FormsModule],
  templateUrl: './profi.component.html',
})
export class ProfiComponent implements OnInit, AfterContentInit {
  userName: string | undefined ='';
  phoneNumer: string | undefined='';
  value3: string | undefined='';
  ngAfterContentInit(): void {}
  visible: boolean = false;
  visible1: boolean = false;
 
  cities: City[] | undefined;

  selectedCity: City | undefined;

  ngOnInit() {
      this.cities = [
          { name: 'New York', code: 'NY' },
          { name: 'Rome', code: 'RM' },
          { name: 'London', code: 'LDN' },
          { name: 'Istanbul', code: 'IST' },
          { name: 'Paris', code: 'PRS' }
      ];
  }
 
  host: string = 'https://provinces.open-api.vn/api/';
  callAPI = (api: string) => {
    return axios.get(api).then((response) => {
      console.log(response);
      this.renderData(response.data, 'city');
    });
  };
  callApiDistrict = (api: string) => {
    return axios.get(api).then((response) => {
      this.renderData(response.data.districts, 'district');
    });
  };
  callApiWard = (api: string) => {
    return axios.get(api).then((response) => {
      this.renderData(response.data.wards, 'ward');
    });
  };

  renderData = (array: [], select: string) => {
    let row = `<option class="tw-capitalize" disable value="">${select}</option>`;
    array.forEach((element: City) => {
      row += `<option data-id="${element.code}" value="${element.name}">${element.name}</option>`;
    });
    const tt = document.querySelector(`#${select}`) as HTMLSelectElement;
    console.log(tt);
    tt.innerHTML = row;
  };

  printResult = () => {
    if (
      $('#district').find(':selected').data('id') != '' &&
      $('#city').find(':selected').data('id') != '' &&
      $('#ward').find(':selected').data('id') != ''
    ) {
      let result =
        $('#city option:selected').text() +
        ' , ' +
        $('#district option:selected').text() +
        ' , ' +
        $('#ward option:selected').text();
      $('#float-input').val(result);
    }
  };

  onSelectChangeCity() {
    this.callApiDistrict(
      this.host + 'p/' + $('#city').find(':selected').data('id') + '?depth=2'
    );
    this.printResult();
  }
  onSelectChangeDistrict() {
    this.callApiWard(
      this.host +
        'd/' +
        $('#district').find(':selected').data('id') +
        '?depth=2'
    );
    this.printResult();
  }
  onSelectChangeWard() {
    this.printResult();
  }

  showDialog() {
    this.visible = true;
  }
  showDialog1() {
    this.visible1 = true;
    this.callAPI('https://provinces.open-api.vn/api/?depth=1');
  }

 
}
