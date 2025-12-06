import {
  AfterViewInit,
  Component, effect, EffectRef,
  ElementRef,
  HostListener,
  input,
  InputSignal, OnDestroy,
  output,
  signal,
  ViewChild
} from '@angular/core';
import {PeriodicElement} from '../../../class/periodicElement';
import {AsyncPipe, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {form, Field} from '@angular/forms/signals';
import {GameService} from '../../../service/game/game.service';
import {Settings, SettingService} from '../../../service/setting/setting.service';
import {firstValueFrom, Observable} from 'rxjs';


interface AnswerData {
  name: string;
  symbol: string;
  atomicNumber: number;
  mass: number;
  period: number;
  group: number;
}

@Component({
  selector: 'app-element-modal',
  imports: [
    NgStyle,
    FormsModule,
    Field,
    AsyncPipe,
  ],
  templateUrl: './element-modal.html',
  styleUrl: './element-modal.scss',
})
export class ElementModal implements AfterViewInit, OnDestroy  {
  @ViewChild('answerInput') answerInput!: ElementRef<HTMLInputElement>;
  public element: InputSignal<PeriodicElement> = input.required<PeriodicElement>();
  public wasCorrect: InputSignal<boolean> = input.required<boolean>();

  public close = output<void>();
  public correctAnswered = output<void>();

  public isModalVisible = false;

  public answerModel = signal<AnswerData>({
    name: '',
    symbol: '',
    atomicNumber: 0,
    mass: 0,
    period: 0,
    group: 0
  });

  public answerForm = form(this.answerModel);

  public settings$: Observable<Settings>;

  constructor(private readonly gameService: GameService,
              private readonly settingsService: SettingService) {
    this.settings$ = this.settingsService.getSettings$();
  }
  public closeModal(): void {
    this.close.emit();
  }

  public async markAsCorrect() {
    console.log("MARK AS CORRECT triggered");
    if(this.wasCorrect()){

      console.log("ALREADY CORRECT");
      this.closeModal();
      return;
    }

    const settings = await firstValueFrom(this.settings$);


    const correct = (!settings.nameAnswerEnabled ||
        this.answerForm.name().value().toLowerCase() === this.element().name.toLowerCase()) &&
      (!settings.symbolAnswerEnabled ||
        this.answerForm.symbol().value().toLowerCase() === this.element().symbol.toLowerCase()) &&
      (!settings.atomicNumberAnswerEnabled ||
        this.answerForm.atomicNumber().value() === this.element().number) &&
      (!settings.massAnswerEnabled ||
        this.answerForm.mass().value() === Math.floor(this.element().atomic_mass)) &&
      (!settings.periodAnswerEnabled||
        this.answerForm.period().value() === this.element().period) &&
      (!settings.groupAnswerEnabled ||
        this.answerForm.group().value() === this.element().group);

    await this.gameService.recordAttempt(this.element(), correct);

    if(correct) {
      this.correctAnswered.emit();
    }

  }

  private elementEffect?: EffectRef = effect(() => {
    this.element(); // track changes
    queueMicrotask(() => this.focusInput());
  });


  ngAfterViewInit(): void {
    // Focus when modal first appears
    this.focusInput();
    this.isModalVisible = true;
  }

  ngOnDestroy(): void {
    this.elementEffect?.destroy();
    this.isModalVisible = false;
  }

  private focusInput(): void {
    const el = this.answerInput?.nativeElement;
    if (!el) return;
    queueMicrotask(() => el.focus());
  }

  @HostListener('document:keydown.enter', ['$event'])
  async onDocumentEnter(event: Event) {
    if(!this.isModalVisible) return;
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();                // prevent form submit / default
    keyboardEvent.stopPropagation();
    await this.markAsCorrect();
  }

}
