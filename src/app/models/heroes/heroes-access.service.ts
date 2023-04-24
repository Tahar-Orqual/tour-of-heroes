import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Hero } from "./heroes";
import { HttpAccessService } from "src/app/core/services/http-access.service";

@Injectable({
  providedIn: "root",
})
export class HeroesAccessService extends HttpAccessService<
  Hero,
  Omit<Hero, "id">,
  Omit<Hero, "id">,
  unknown
> {
  protected override readonly apiUrl = "api/heroes";

  findSomeHeroesByName$(queryName: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(
      `${this.apiUrl}?name=${queryName}`,
      this.httpOptions
    );
  }
}
