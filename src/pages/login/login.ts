import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  user = {} as User;

  constructor(private afauth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
  }

  async login(user: User) {
    try {
     const result = this.afauth.auth.signInWithEmailAndPassword(user.email, user.password);
     console.log(result);
     if(result){
       this.navCtrl.parent.select(1);
     }
    } catch (e) {
      console.error (e);
    }
    }

    register(user: User) {
      try {
        const result = this.afauth.auth.createUserWithEmailAndPassword(user.email, user.password);
        console.log(result);
        if(result){
          this.navCtrl.parent.select(1);
        }
       } catch (e) {
         console.error (e);
       }
       }
    

    


}