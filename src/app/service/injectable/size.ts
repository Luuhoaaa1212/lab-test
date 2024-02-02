import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  sizeId: string = '';

  setSizeId(id: string): void {
    this.sizeId = id;
  }

  getSizeId(): string {
    return this.sizeId;
  }
}