import {Component, ElementRef, ViewChild} from '@angular/core';
import {PeriodicElement, periodicTable, SimpleElement, simpleElements} from '../../class/periodicElement';
import {ElementTile} from './element-tile/element-tile';
import {ElementModal} from './element-modal/element-modal';
import {GameService} from '../../service/game/game.service';
import {AsyncPipe} from '@angular/common';
import {BehaviorSubject, map} from 'rxjs';

@Component({
  selector: 'app-periodic-table',
  imports: [
    ElementTile,
    ElementModal,
    AsyncPipe

  ],
  templateUrl: './periodic-table.html',
  styleUrl: './periodic-table.scss',
})
export class PeriodicTable {

  protected readonly periodicTable = periodicTable;
  public selectedElement: PeriodicElement | null = null;

  public correctElements: Set<PeriodicElement> = new Set<PeriodicElement>();

  public totalAttempts$;
  public firstTryCorrect$;
  public totalCorrect$;
  public timePassedSubject = new BehaviorSubject(0);
  public timePassed$ = this.timePassedSubject.asObservable();

  constructor(private readonly gameService: GameService) {
    this.totalAttempts$ = this.gameService.totalAttempts$;
    this.firstTryCorrect$ = this.gameService.firstTryCorrectElements$;
    this.totalCorrect$ = this.gameService.totalCorrectElements$;
    setInterval(() => {
      this.gameService.startedAt$.pipe(
        map(startedAt => {
          if (startedAt) {
            const now = new Date();
            const diff = now.getTime() - startedAt.getTime();
            return diff / 1000;
          } else {
            return 0;
          }
        })
      ).subscribe(seconds => {
        this.timePassedSubject.next(seconds);
      });
    }, 50);
  }



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
