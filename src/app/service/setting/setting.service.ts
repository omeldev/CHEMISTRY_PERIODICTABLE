import {Injectable, signal} from '@angular/core';
import {BehaviorSubject, firstValueFrom} from 'rxjs';
import {ORIGINAL_PERIODIC_TABLE, periodicTable} from '../../class/periodicElement';


export interface Settings {
  shuffleEnabled: boolean;
  colorsEnabled: boolean;

  symbolHintEnabled: boolean;
  nameHintEnabled: boolean;
  atomicNumberHintEnabled: boolean;
  massHintEnabled: boolean;

  symbolAnswerEnabled: boolean;
  nameAnswerEnabled: boolean;
  atomicNumberAnswerEnabled: boolean;
  massAnswerEnabled: boolean;
  periodAnswerEnabled: boolean;
  groupAnswerEnabled: boolean;
  phaseAnswerEnabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  shuffleEnabled: false,
  colorsEnabled: true,

  symbolHintEnabled: true,
  nameHintEnabled: false,
  atomicNumberHintEnabled: false,
  massHintEnabled: false,

  symbolAnswerEnabled: true,
  nameAnswerEnabled: false,
  atomicNumberAnswerEnabled: false,
  massAnswerEnabled: false,
  periodAnswerEnabled: false,
  groupAnswerEnabled: false,
  phaseAnswerEnabled: false,
}

export const settingsKey = 'periodic-table-game-settings';

@Injectable({
  providedIn: 'root',
})
export class SettingService {

  private readonly settingsSubject = new BehaviorSubject<Settings>(DEFAULT_SETTINGS);
  private readonly settings$ = this.settingsSubject.asObservable();


  constructor() {
    const savedSettings = localStorage.getItem(settingsKey);
    if (savedSettings) {
      this.settingsSubject.next(JSON.parse(savedSettings));
    }
  }

  public getSettings$() {
    return this.settings$
  }

  public async patchSettings(patch: Partial<Settings>) {
    const currentSettings = await firstValueFrom(this.settings$);
    const updatedSettings = { ...currentSettings, ...patch };

    this.settingsSubject.next(updatedSettings);
    localStorage.setItem(settingsKey, JSON.stringify(updatedSettings));
  }

  public async shuffleElementPositions() {
    //Shuffle elements positions on the periodic table

    type elementPosition = {
      xpos: number;
      ypos: number;
    }

    const possiblePositions: elementPosition[] = [];
    for(const element of periodicTable.elements) {
      possiblePositions.push({xpos: element.xpos, ypos: element.ypos});
    }

    for(const element of periodicTable.elements) {
      const randomIndex = Math.floor(Math.random() * possiblePositions.length);
      const newPosition = possiblePositions.splice(randomIndex, 1)[0];
      element.xpos = newPosition.xpos;
      element.ypos = newPosition.ypos;
    }
  }

  public resetElementPositions() {
    for(let i = 0; i < periodicTable.elements.length; i++) {
      const originalElement = ORIGINAL_PERIODIC_TABLE.elements[i];
      periodicTable.elements[i].xpos = originalElement.xpos;
      periodicTable.elements[i].ypos = originalElement.ypos;
    }
  }

}
