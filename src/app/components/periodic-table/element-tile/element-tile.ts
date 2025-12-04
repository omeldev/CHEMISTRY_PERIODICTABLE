import {Component, EventEmitter, input, Input, InputSignal, output, Output, Signal, signal} from '@angular/core';
import {PeriodicElement, periodicTable, PeriodicTable} from '../../../class/periodicElement';
import {AsyncPipe, NgStyle} from '@angular/common';
import {Settings, SettingService} from '../../../service/setting/setting.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-element-tile',
  imports: [
    NgStyle,
    AsyncPipe
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

  public settings$: Observable<Settings>;
  constructor(private readonly settingsService: SettingService) {
    this.settings$ = this.settingsService.getSettings$();
  }

  protected readonly Math = Math;
  protected readonly Number = Number;
}
