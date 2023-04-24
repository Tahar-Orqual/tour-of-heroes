import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLinkWithHref, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLinkWithHref],
  template: `
    <header class="container mx-auto px-6 py-4">
      <h1 class="text-[#264D73] text-4xl font-bold">Tour of Heroes</h1>
      <nav>
        <a
          class="inline-block p-4 mt-4 mr-4 text-[#3d3d3d] bg-[#e8e8e8] rounded hover:bg-[#42545C] hover:text-white"
          routerLink="/dashboard"
        >
          Dashboard
        </a>
        <a
          class="inline-block p-4 mt-4 mr-4 text-[#3d3d3d] bg-[#e8e8e8] rounded hover:bg-[#42545C] hover:text-white"
          routerLink="/heroes"
        >
          Heroes
        </a>
      </nav>
    </header>
    <main class="container mx-auto px-6 py-8">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
