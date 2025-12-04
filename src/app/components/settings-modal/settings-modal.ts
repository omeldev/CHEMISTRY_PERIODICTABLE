import {Component, output, signal} from '@angular/core';
import {DEFAULT_SETTINGS, Settings, SettingService} from '../../service/setting/setting.service';
import {Field, form} from '@angular/forms/signals';
import {ReactiveFormsModule} from '@angular/forms';
import {firstValueFrom, Observable, tap} from 'rxjs';

interface SettingsModelData {
  settings: Settings
}

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.html',
  styleUrls: ['./settings-modal.scss'],
  imports: [
    ReactiveFormsModule,
    Field
  ]
})
export class SettingsModal {
  public settings: Observable<Settings>;

  public close = output<void>();


  public settingsModel = signal<SettingsModelData>({
    settings: DEFAULT_SETTINGS
  });

  public settingsForm ;


  constructor(private readonly settingService: SettingService) {
    this.settings = this.settingService.getSettings$().pipe(
      tap(settings => {
        this.settingsModel.update(model => ({
          ...model,
          settings: settings
        }));
      })
    );

    void firstValueFrom(this.settingService.getSettings$()).then(settings => {
      this.settingsModel.set({
        settings: settings
      });
    })

    this.settingsForm = form(this.settingsModel);
  }


  public closeModal(): void {
    this.close.emit();
  }

  public async saveSettings() {
    const updateSettings = this.settingsForm.settings().value();
    await this.settingService.patchSettings(updateSettings)
    this.close.emit();
  }

  async shuffleElements() {
    await this.settingService.shuffleElementPositions();
  }

  async resetElements() {
    this.settingService.resetElementPositions();
  }
}
