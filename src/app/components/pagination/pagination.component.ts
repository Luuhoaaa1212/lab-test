import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [PaginatorModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() totalItem:number = 0;
  first: number = 0;
  rows: number = 8;
  @Output() onchangePage: EventEmitter<any> = new EventEmitter();

  onPageChange(event: any) {
      this.first = event.first;
      this.rows = event.rows;
      this.onchangePage.emit({
        first: event.first,
        rows: event.rows,
        page: event.page
      })
  }

}
