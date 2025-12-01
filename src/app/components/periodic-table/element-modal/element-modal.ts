import {
  AfterViewInit,
  Component, effect, EffectRef,
  ElementRef,
  EventEmitter, HostListener,
  input,
  Input,
  InputSignal, OnDestroy,
  output,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {PeriodicElement} from '../../../class/periodicElement';
import {AsyncPipe, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {form, Field} from '@angular/forms/signals';
import {GameService} from '../../../service/game/game.service';


interface AnswerData {
  name: string;
  symbol: string;
  atomicNumber: number | null;
  mass: number | null;
  period: number | null;
  group: number | null;
}

@Component({
  selector: 'app-element-modal',
  imports: [
    NgStyle,
    FormsModule,
    Field,
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
    atomicNumber: null,
    mass: null,
    period: null,
    group: null
  });

  public answerForm = form(this.answerModel);

  constructor(private readonly gameService: GameService) {

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
    const correct = this.answerForm.name().value().toLowerCase() == this.element().name.toLowerCase();
    /**  if(this.symbolAnswer().toLowerCase() !== this.element().symbol.toLowerCase()) return;
     if(this.atomicNumberAnswer() !== this.element().number) return;
     if(this.massAnswer() !== Math.round(this.element().atomic_mass)) return;
     if(this.periodAnswer() !== this.element().period) return;
     if(this.groupAnswer() !== this.element().group) return;
     **/

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
  onDocumentEnter(event: Event) {
    if(!this.isModalVisible) return;
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();                // prevent form submit / default
    keyboardEvent.stopPropagation();
    this.markAsCorrect();
  }

}
