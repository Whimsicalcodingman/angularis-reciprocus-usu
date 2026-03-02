import { ChangeDetectionStrategy, Component, } from '@angular/core';
import { MatButtonModule, } from '@angular/material/button';
import { MatSidenavModule, } from '@angular/material/sidenav';
import { RouterOutlet, } from '@angular/router';

@Component({
  selector: 'app-wrapper',
  imports: [
    // 3rd party
    MatSidenavModule,
    MatButtonModule,
    RouterOutlet
  ],
  templateUrl: './app-wrapper.component.html',
  styleUrl: './app-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppWrapperComponent {
  public showFiller = false;
}
