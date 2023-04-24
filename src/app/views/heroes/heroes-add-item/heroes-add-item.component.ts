import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";
import { RouterLinkWithHref } from "@angular/router";

@Component({
  selector: "app-heroes-add-item",
  standalone: true,
  imports: [RouterLinkWithHref],
  template: `
    <section class="container my-4">
      <label for="new-hero">Hero name: </label>
      <input
        class="w-full p-4 text-lg border rounded"
        id="new-hero"
        #heroName
      />
      <button
        class="mt-4 mr-2 p-4 rounded bg-[#eee] hover:bg-[#cfd8dc]"
        type="button"
        aria-label="Add an hero"
        (click)="onClickToAddHero(heroName.value); heroName.value = ''"
      >
        Add
      </button>
    </section>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesAddItemComponent {
  @Output() private readonly addHeroEvent = new EventEmitter<string>();

  onClickToAddHero(heroName: string) {
    this.addHeroEvent.emit(heroName);
  }
}
