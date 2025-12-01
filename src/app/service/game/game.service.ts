import { Injectable } from '@angular/core';
import {BehaviorSubject, firstValueFrom, map, reduce, Subject} from 'rxjs';
import {PeriodicElement, periodicTable} from '../../class/periodicElement';

@Injectable({
  providedIn: 'root',
})
export class GameService {

  private readonly startedAtSubject: BehaviorSubject<Date | null> = new BehaviorSubject<Date | null>(null);
  public readonly startedAt$ = this.startedAtSubject.asObservable();

  public readonly finishedAtSubject: BehaviorSubject<Date | null> = new BehaviorSubject<Date | null>(null);
  public readonly finishedAt$ = this.finishedAtSubject.asObservable();

  private readonly firstTryCorrectElementsSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  public readonly firstTryCorrectElements$ = this.firstTryCorrectElementsSubject.asObservable();


  private readonly totalCorrectElementsSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  public readonly totalCorrectElements$ = this.totalCorrectElementsSubject.asObservable();

  private readonly elementAttemtsSubject: BehaviorSubject<Map<PeriodicElement, number>> = new BehaviorSubject(new Map<PeriodicElement, number>());
  public readonly elementAttempts$ = this.elementAttemtsSubject.asObservable();

  public readonly totalAttempts$;

  constructor() {
    this.totalAttempts$ = this.elementAttempts$.pipe(
      map(attemptMap => [...attemptMap.values()].reduce((sum, n) => sum + n, 0))
    );  }


  public async recordAttempt(element: PeriodicElement, correct: boolean) {
    const elementAttempts = await firstValueFrom(this.elementAttemtsSubject);
    const currentAttempts = elementAttempts.get(element) || 0;
    if(correct) {

      if (currentAttempts === 0) {
        const firstTryCorrect = await firstValueFrom(this.firstTryCorrectElements$);
        this.firstTryCorrectElementsSubject.next(firstTryCorrect + 1);
      }
    }
    elementAttempts.set(element, currentAttempts + 1);
    this.elementAttemtsSubject.next(elementAttempts);

    if (correct) {
      const totalCorrect = await firstValueFrom(this.totalCorrectElements$);
      this.totalCorrectElementsSubject.next(totalCorrect + 1);

    }

    const startedAt = await firstValueFrom(this.startedAt$);
    if (!startedAt) {
      this.startedAtSubject.next(new Date());
    }

    const isFinished = await firstValueFrom(this.totalCorrectElements$) == periodicTable.elements.length;
    if (isFinished) {
      this.finishedAtSubject.next(new Date());
    }

  }


}
