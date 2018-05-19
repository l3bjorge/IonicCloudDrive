import { DatabaseProvider } from './../../providers/database/database';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
 
@Component({
  selector: 'page-file-manager',
  templateUrl: 'file-manager.html',
})
export class FileManagerPage {
  developer = {};
  developers = [];
 
  constructor(public navCtrl: NavController, private databaseprovider: DatabaseProvider, private platform: Platform) {
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadDeveloperData();
      }
    })
  }
 
  loadDeveloperData() {
    this.databaseprovider.getAllDevelopers().then(data => {
      this.developers = data;
    })
  }
 
  addDeveloper() {
    this.databaseprovider.addDeveloper(this.developer['name'], this.developer['skill'], parseInt(this.developer['yearsOfExperience']))
    .then(data => {
      this.loadDeveloperData();
    });
    this.developer = {};
  }
 
}