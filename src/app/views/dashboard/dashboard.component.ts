import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { RouterLinkWithHref } from "@angular/router";
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
  takeUntil,
} from "rxjs";
import { Hero } from "src/app/models/heroes/heroes";
import { HeroesAccessService } from "src/app/models/heroes/heroes-access.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLinkWithHref],
  template: `
    <h2 class="text-2xl text-center text-[#444]">Top Heroes</h2>
    <input
      class="w-full mt-4 p-4 text-md text-[#333] border rounded"
      id="hero-name"
      [formControl]="heroSearch"
      placeholder="Hero name"
    />
    <nav class="heroes-menu">
      <a
        class="inline-block w-full p-4 mt-4 mr-4 text-center text-xl bg-[#3f525c] text-white rounded hover:bg-black"
        *ngFor="let hero of heroes$ | async"
        routerLink="/detail/{{ hero.id }}"
      >
        {{ hero.name }}
      </a>
    </nav>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly heroesAccess = inject(HeroesAccessService);
  private readonly destroySubject = new Subject<boolean>();
  private readonly heroesSubject = new Subject<Hero[]>();
  protected readonly heroes$ = this.heroesSubject.asObservable();
  protected readonly heroSearch = new FormControl<string>("");

  ngOnInit(): void {
    this.getTopHeroes();
    this.listenToSearchHeroes();
  }

  private getTopHeroes(): void {
    this.heroesAccess
      .findAll$()
      .pipe(
        map((heroes) => heroes.slice(0, 5)),
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

  private listenToSearchHeroes(): void {
    this.heroSearch.valueChanges
      .pipe(
        map((value) => value?.trimStart().trimEnd()),
        filter((value) => {
          if (value === "") {
            this.getTopHeroes();
          }
          return value !== undefined && value.length > 0;
        }),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((queryName) => {
          if (!queryName) return of([] as Hero[]);
          return this.heroesAccess.findSomeHeroesByName$(queryName);
        }),
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

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }
}
