import { Injectable } from "@angular/core";
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
}
