import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLinkWithHref } from "@angular/router";
import { HeroesAccessService } from "src/app/models/heroes/heroes-access.service";
import { BehaviorSubject, Subject, catchError, of, takeUntil } from "rxjs";
import { HeroesItemComponent } from "./heroes-item/heroes-item.component";
import { HeroesAddItemComponent } from "./heroes-add-item/heroes-add-item.component";
import { Hero } from "src/app/models/heroes/heroes";

@Component({
  selector: "app-heroes",
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkWithHref,
    HeroesAddItemComponent,
    HeroesItemComponent,
  ],
  template: `
    <h2 class="text-2xl text-left text-[#444]">My Heroes</h2>
    <app-heroes-add-item (addHeroEvent)="onAddHeroEvent($event)" />
    <ul class="">
      <app-heroes-item
        *ngFor="let hero of heroes$ | async"
        [hero]="hero"
        (deleteHeroEvent)="onDeleteHeroEvent($event)"
      />
    </ul>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesComponent implements OnInit, OnDestroy {
  private readonly heroesAccess = inject(HeroesAccessService);
  private readonly destroySubject = new Subject<boolean>();
  private readonly heroesSubject = new BehaviorSubject<Hero[]>([]);
  protected readonly heroes$ = this.heroesSubject.asObservable();

  ngOnInit(): void {
    this.getHeroes();
  }

  private getHeroes(): void {
    this.heroesAccess
      .findAll$()
      .pipe(
        catchError((err) => {
          console.error(err);
          return of([] as Hero[]);
        }),
        takeUntil(this.destroySubject)
      )
      .subscribe((heroes) => {
        this.heroesSubject.next(heroes);
      });
  }

  onAddHeroEvent(name: string): void {
    const heroName = name.trimStart().trimEnd();
    if (!heroName) return;
    this.heroesAccess
      .createOne$({ name: heroName })
      .pipe(takeUntil(this.destroySubject))
      .subscribe((hero) => {
        this.heroesSubject.next([...this.heroesSubject.getValue(), hero]);
      });
  }

  onDeleteHeroEvent(hero: Hero): void {
    this.heroesAccess
      .deleteOne$(hero.id)
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        this.heroesSubject.next(
          this.heroesSubject.getValue().filter((h) => h !== hero)
        );
      });
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }
}
