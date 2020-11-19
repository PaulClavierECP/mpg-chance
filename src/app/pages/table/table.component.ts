import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MemberRanking } from '../../mpg-client/types';
import { Sort } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnChanges {
  @Input() table: MemberRanking[];
  dataSource: MatTableDataSource<MemberRanking> = new MatTableDataSource(
    this.table
  );

  @ViewChild(MatSort) sort: MatSort;

  columns = ['name', 'points', 'rank', 'expPoints', 'expRank'];

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.table);
    this.dataSource.sort = this.sort;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
}
