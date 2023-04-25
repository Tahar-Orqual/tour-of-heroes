import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
  Input,
} from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { HeroesAccessService } from "src/app/models/heroes/heroes-access.service";
import { Subject, catchError, of, takeUntil, filter } from "rxjs";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Hero } from "src/app/models/heroes/heroes";

@Component({
  selector: "app-hero-detail",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
  <ng-container *ngIf="!error; else errorTmp">
    <section *ngIf="hero(); else loadingTmp">
      <h2 class="text-2xl text-left text-[#444]">
        {{ hero()?.name | uppercase }} Details
      </h2>
      <p><span>id: </span>{{ hero()?.id }}</p>
      <p>
        <label class="font-bold text-[#435960]" for="hero-name">
          Hero name:
        </label>
        <input
          class="p-4 text-md text-[#333] border rounded"
          id="hero-name"
          placeholder="Hero name"
          [formControl]="nameControl"
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
        (click)="onClickToSaveHero()"
      >
        save
      </button>
    </section>
    </ng-container>
    <ng-template #loadingTmp>
      loading...
    </ng-template>
    <ng-template #errorTmp>
      error...
    </ng-template>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  private readonly location = inject(Location);
  private readonly heroesAccess = inject(HeroesAccessService);
  private readonly destroySubject = new Subject<boolean>();

  @Input("id") id!: string;

  protected readonly hero = signal<Hero | undefined>(undefined);
  protected readonly nameControl = new FormControl('')
  protected error = false

  ngOnInit(): void {
    this.getHero();
    this.listenName()
  }

  private getHero(): void {
    this.heroesAccess
      .findOne$(this.id)
      .pipe(
        catchError((err) => {
          console.error(err);
          return of(undefined);
        }),
        takeUntil(this.destroySubject)
      )
      .subscribe((hero) => this.hero.set(hero));
  }

  private listenName(): void {
    this.nameControl.valueChanges.pipe(
      filter((value) => {
        if (value === "") {
          this.getHero();
        }
        return value !== undefined && value !== null && value !== "";
      }),
      takeUntil(this.destroySubject)
    ).subscribe((name) => {
      const hero = this.hero()
      if(hero && name) this.hero.set({
        ...hero,
        name
      })
    })
  }

  protected onClickToSaveHero(): void {
    const hero = this.hero();
    if (hero)
      this.heroesAccess
        .updateOne$(hero.id, hero)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(() => this.onClickToGoBack());
  }

  protected onClickToGoBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }
}
