import {Component, EventEmitter, input, Input, InputSignal, output, Output, signal} from '@angular/core';
import {PeriodicElement} from '../../../class/periodicElement';
import {NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {form, Field} from '@angular/forms/signals';


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
    Field
  ],
  templateUrl: './element-modal.html',
  styleUrl: './element-modal.scss',
})
export class ElementModal {

  public element: InputSignal<PeriodicElement> = input.required<PeriodicElement>();
  public wasCorrect: InputSignal<boolean> = input.required<boolean>();

  public close = output<void>();
  public correctAnswered = output<void>();

  public answerModel = signal<AnswerData>({
    name: '',
    symbol: '',
    atomicNumber: null,
    mass: null,
    period: null,
    group: null
  });

  public answerForm = form(this.answerModel);

  public closeModal(): void {
    this.close.emit();
  }

  public markAsCorrect(): void {
    console.log("MARK AS CORRECT triggered");
    if(this.wasCorrect()){

      console.log("ALREADY CORRECT");
      this.closeModal();
        return;
    }
    if(this.answerForm.name().value().toLowerCase() !== this.element().name.toLowerCase()) return;
  /**  if(this.symbolAnswer().toLowerCase() !== this.element().symbol.toLowerCase()) return;
    if(this.atomicNumberAnswer() !== this.element().number) return;
    if(this.massAnswer() !== Math.round(this.element().atomic_mass)) return;
    if(this.periodAnswer() !== this.element().period) return;
    if(this.groupAnswer() !== this.element().group) return;
    **/
    this.correctAnswered.emit();


  }


}
