import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { FileManagerPage } from '../file-manager/file-manager';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LoginPage;
  tab2Root = HomePage;
  tab3Root = FileManagerPage;
  tab4Root = AboutPage;

  constructor() {

  }
}
