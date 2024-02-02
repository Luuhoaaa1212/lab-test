import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  colorId: string = '';
  setColorId(id: string): void {
    this.colorId = id;
  }
  getColorId(): string {
    return this.colorId;
  }
}