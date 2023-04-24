import { Route } from "@angular/router";
import { DashboardComponent } from "src/app/views/dashboard/dashboard.component";
import { HeroDetailComponent } from "src/app/views/hero-detail/hero-detail.component";
import { HeroesComponent } from "src/app/views/heroes/heroes.component";

export const APP_ROUTES: Route[] = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "heroes",
    component: HeroesComponent,
  },
  {
    path: "detail/:id",
    component: HeroDetailComponent,
  },
];
