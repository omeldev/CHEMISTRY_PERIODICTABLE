import { Component } from '@angular/core';
import {PeriodicElement, periodicTable, SimpleElement, simpleElements} from '../../class/periodicElement';
import {ElementTile} from './element-tile/element-tile';
import {ElementModal} from './element-modal/element-modal';

@Component({
  selector: 'app-periodic-table',
  imports: [
    ElementTile,
    ElementModal

  ],
  templateUrl: './periodic-table.html',
  styleUrl: './periodic-table.scss',
})
export class PeriodicTable {

  protected readonly periodicTable = periodicTable;
  public selectedElement: PeriodicElement | null = null;

  public correctElements: Set<PeriodicElement> = new Set<PeriodicElement>();

  public markElementAsCorrect(): void {
    if (this.selectedElement) {
      this.correctElements.add(this.selectedElement);
    }
  }


  public closeModal(): void {
    this.selectedElement = null;
  }

  public openModal(element: PeriodicElement): void {
    this.selectedElement = element;
    console.log("OPEN MODAL", element);
  }


}
