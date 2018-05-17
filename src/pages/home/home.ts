import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { storage } from 'firebase';

//Home
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private camera: Camera, public navCtrl: NavController) {

  }

async takePhoto() {
  try{
  //Defining camera options

  const options: CameraOptions = {
    quality: 50,
    targetHeight: 600,
    targetWidth: 600,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  
  const result = await this.camera.getPicture(options);
  
  const image = `data:image/jpeg;base64,${result}`;

  const pictures = storage().ref('pictures');
  pictures.putString(image, 'data_url');
}
catch (e) {
  console.error(e);
}
}



}
