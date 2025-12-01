import {Component, EventEmitter, input, Input, InputSignal, output, Output, Signal, signal} from '@angular/core';
import {PeriodicElement, periodicTable, PeriodicTable} from '../../../class/periodicElement';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-element-tile',
  imports: [
    NgStyle
  ],
  templateUrl: './element-tile.html',
  styleUrl: './element-tile.scss',
})
export class ElementTile {

  public element: InputSignal<PeriodicElement> = input.required<PeriodicElement>();
  public selectElement = output<void>()

  public correct = input<boolean>(false);

  public openModal(): void {
    this.selectElement.emit();
    console.log("SELECTED", this.element());
  }

  protected readonly Math = Math;
  protected readonly Number = Number;
}
