import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DataProvider } from './../../providers/data/data';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { storage } from 'firebase';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Observable } from 'rxjs/Observable';

//Home
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  files: Observable<any[]>;

  constructor(private camera: Camera, public navCtrl: NavController,  private dataProvider: DataProvider, private alertCtrl: AlertController, private toastCtrl: ToastController, private iab: InAppBrowser) {
    this.files = this.dataProvider.getFiles();
  }

addFile() {
  let inputAlert = this.alertCtrl.create({
    title: 'Store new information',
    inputs: [
      {
        name: 'info',
        placeholder: 'Lorem ipsum dolor...'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Store',
        handler: data => {
          this.uploadInformation(data.info);
        }
      }
    ]
  });
  inputAlert.present();
}

uploadInformation(text) {
  let upload = this.dataProvider.uploadToStorage(text);

  // Perhaps this syntax might change, it's no error here!
  upload.then().then(res => {
    this.dataProvider.storeInfoToDatabase(res.metadata).then(() => {
      let toast = this.toastCtrl.create({
        message: 'New File added!',
        duration: 3000
      });
      toast.present();
    });
  });
}

async uploadPhoto(text) {
  try{
  //Defining camera options

  const options: CameraOptions = {
    quality: 50,
    targetHeight: 600,
    targetWidth: 600,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }
  
  const result = await this.camera.getPicture(options);
  
  const image = `data:image/jpeg;base64,${result}`;

  let upload = this.dataProvider.uploadImgToStorage(image);

  upload.then().then(res => {
    this.dataProvider.storeInfoToDatabase(res.metadata).then(() => {
      let toast = this.toastCtrl.create({
        message: 'New Img added!',
        duration: 3000
      });
      toast.present();
    });
  });
}
catch (e) {
  console.error(e);
}
}

deleteFile(file) {
  this.dataProvider.deleteFile(file).subscribe(() => {
    let toast = this.toastCtrl.create({
      message: 'File removed!',
      duration: 3000
    });
    toast.present();
  });
}

viewFile(url) {
  this.iab.create(url);
}



}
