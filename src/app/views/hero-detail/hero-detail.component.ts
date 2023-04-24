import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HeroesAccessService } from "src/app/models/heroes/heroes-access.service";
import { Subject, catchError, of, takeUntil } from "rxjs";
import { FormsModule } from "@angular/forms";
import { Hero } from "src/app/models/heroes/heroes";

@Component({
  selector: "app-hero-detail",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section *ngIf="hero$ | async as hero">
      <h2 class="text-2xl text-left text-[#444]">
        {{ hero.name | uppercase }} Details
      </h2>
      <p><span>id: </span>{{ hero.id }}</p>
      <p>
        <label class="font-bold text-[#435960]" for="hero-name">
          Hero name:
        </label>
        <input
          class="p-4 text-md text-[#333] border rounded"
          id="hero-name"
          [(ngModel)]="hero.name"
          placeholder="Hero name"
        />
      </p>
      <button
        class="mt-4 mr-2 p-4 rounded bg-[#eee] hover:bg-[#cfd8dc]"
        type="button"
        (click)="onClickToGoBack()"
      >
        go back
      </button>
      <button
        class="mt-4 mr-2 p-4 rounded bg-[#eee] hover:bg-[#cfd8dc]"
        type="button"
        (click)="onClickToSaveHero(hero)"
      >
        save
      </button>
    </section>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly heroesAccess = inject(HeroesAccessService);
  private readonly destroySubject = new Subject<boolean>();
  private readonly heroSubject = new Subject<Hero | undefined>();
  protected readonly hero$ = this.heroSubject.asObservable();

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get("id");
    if (idStr) this.getHero(idStr);
  }

  private getHero(idStr: string): void {
    const id = parseInt(idStr, 10);
    this.heroesAccess
      .findOne$(id)
      .pipe(
        catchError((err) => {
          console.error(err);
          return of(undefined);
        }),
        takeUntil(this.destroySubject)
      )
      .subscribe((hero) => this.heroSubject.next(hero));
  }

  onClickToSaveHero(hero: Hero): void {
    this.heroesAccess
      .updateOne$(hero.id, hero)
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => this.onClickToGoBack());
  }

  onClickToGoBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }
}
