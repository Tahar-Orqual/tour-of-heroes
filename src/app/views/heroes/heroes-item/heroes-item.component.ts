import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { RouterLinkWithHref } from "@angular/router";
import { Hero } from "src/app/models/heroes/heroes";

@Component({
  selector: "app-heroes-item",
  standalone: true,
  imports: [RouterLinkWithHref],
  template: `
    <li class="relative my-4 p-2">
      <a
        class="block bg-[#EEE] rounded hover:text-white hover:bg-[#405061]"
        routerLink="/detail/{{ hero.id }}"
      >
        <span
          class="inline-block mr-4 h-full p-4 text-white bg-[#405061] rounded-s-[4px]"
          >{{ hero.id }}</span
        >
        {{ hero.name }}
      </a>
      <button
        type="button"
        class="absolute top-5 right-5 px-3 py-1 rounded text-[#525252] bg-white"
        title="delete hero"
        (click)="onClickToDeleteHero()"
      >
        x
      </button>
    </li>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesItemComponent {
  @Input() hero!: Hero;
  @Output() private readonly deleteHeroEvent = new EventEmitter<Hero>();

  onClickToDeleteHero() {
    this.deleteHeroEvent.emit(this.hero);
  }
}
