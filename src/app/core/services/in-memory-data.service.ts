import { Injectable } from "@angular/core";
import { InMemoryDbService } from "angular-in-memory-web-api";
import { MOCK_HEROES } from "src/app/models/heroes/heroes.constants";

@Injectable({
  providedIn: "root",
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    return { heroes: MOCK_HEROES };
  }
}
