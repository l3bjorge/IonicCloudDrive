import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LoginPage;
  tab2Root = HomePage;
  tab3Root = AboutPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
