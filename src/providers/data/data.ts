import { Injectable } from '@angular/core';
import { LoadingController} from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
 
@Injectable()
export class DataProvider {
 
  constructor(public loadingCtrl: LoadingController, private db: AngularFireDatabase, private afStorage: AngularFireStorage) { }
 
  getFiles() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    let ref = this.db.list('files');
 
    return ref.snapshotChanges().map(changes => {
      loader.dismiss();
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }
 
  uploadToStorage(title, information): AngularFireUploadTask {
    let newName = title + ".txt";
 
    return this.afStorage.ref(`files/${newName}`).putString(information);
  }

  uploadImgToStorage(title, image): AngularFireUploadTask {
    let newName = title + ".JPEG";
 
    return this.afStorage.ref(`pictures/${newName}`).putString(image, 'data_url');
  }

  uploadVidToStorage(blob): AngularFireUploadTask {
    let newName = "sample.jpg";
 
    return this.afStorage.ref(`images/${newName}`).put(blob);
  }
 
  storeInfoToDatabase(metainfo) {
    let toSave = {
      created: metainfo.timeCreated,
      url: metainfo.downloadURLs[0],
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType
    }
    return this.db.list('files').push(toSave);
  }
 
 
  deleteFile(file) {
    let key = file.key;
    let storagePath = file.fullPath;
 
    let ref = this.db.list('files');
 
    ref.remove(key);
    return this.afStorage.ref(storagePath).delete();
  }
}