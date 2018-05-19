import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DataProvider } from './../../providers/data/data';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { storage } from 'firebase';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Observable } from 'rxjs/Observable';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import  firebase  from 'firebase';
declare var window: any;

//Home
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  files: Observable<any[]>;
  public options={
    sourceType:this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    mediaType:this.camera.MediaType.ALLMEDIA,
    destinationType:this.camera.DestinationType.FILE_URI
  }

  public Fbref:any;
  imageURI:any;
  imageFileName:any;

  constructor(private camera: Camera, public navCtrl: NavController,  
    private dataProvider: DataProvider, 
    private alertCtrl: AlertController, 
    private toastCtrl: ToastController, 
    private iab: InAppBrowser,
    private fileChooser: FileChooser,
    public loadingCtrl: LoadingController,
    private transfer: FileTransfer,
    private file: File) {
    this.files = this.dataProvider.getFiles();
    this.Fbref=firebase.storage().ref();
  }

addFile() {
  let inputAlert = this.alertCtrl.create({
    title: 'Store new information',
    inputs: [
      {
        name: 'title',
        placeholder: 'Title'
      },
      {
        name: 'info',
        placeholder: 'Write yout message here'
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
          this.uploadInformation(data.title, data.info);
        }
      }
    ]
  });
  inputAlert.present();
}

uploadInformation(title, text) {
  let upload = this.dataProvider.uploadToStorage(title, text);

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

  let inputAlert = this.alertCtrl.create({
    title: 'Name this Photo',
    inputs: [
      {
        name: 'title',
        placeholder: 'Photo Name'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Save',
        handler: data => {
          let upload = this.dataProvider.uploadImgToStorage(data.title, image);
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
      }
    ]
  });
  inputAlert.present();
  

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

/* getMedia(){
  this.camera.getPicture(this.options).then(fileuri=>{
    window.resolveLocalFileSystemURL("file://"+fileuri, FE=>{
      FE.file(file=>{
        const FR=new FileReader()
        FR.onloadend=(res:any)=>{
          let AF= res.target.result;
          let blob= new Blob([new Uint8Array(AF)], {type:'image/jpg'})
          this.upload(blob)
        };
        FR.readAsArrayBuffer(file);
      })
    })
  }).catch(error=>{
    alert(error)
  })
} */

getMedia(){
  this.camera.getPicture(this.options).then((imageData) => {
    this.imageURI = imageData;
    this.imageURI = 'file://' +this.imageURI;
  }, (err) => {
    console.log(err);
    alert(err);
  });
}

upload(blob:Blob){
  try{
  let upload = this.dataProvider.uploadVidToStorage(blob);
          upload.then().then(res => {
            this.dataProvider.storeInfoToDatabase(res.metadata).then(() => {
              let toast = this.toastCtrl.create({
                message: 'New Vid added!',
                duration: 3000
              });
})
          })
        } catch(e){
          console.error(e);
        }
}

uploadFile() {
  let loader = this.loadingCtrl.create({
    content: "Uploading..."
  });
  loader.present();

  alert(this.imageURI);
  
  try{
  this.file.resolveLocalFilesystemUrl(this.imageURI).then((newUrl)=>{
    alert(JSON.stringify(newUrl));
    loader.dismiss();

  })
} catch(e){
  console.log(e);
  alert(e);
}

  
}
}
