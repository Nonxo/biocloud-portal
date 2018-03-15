import {Injectable} from "@angular/core";
@Injectable()
export class PictureUtil {

  logo:any;

  restrictFilesSize(fileSize):boolean {
    if (fileSize / 1024 > 100) {
      return false
    }
    return true
  }

  resize(img, MAX_WIDTH:number, MAX_HEIGHT:number, callback) {
    //This will wait until the img is loaded before calling this function
    return img.onload = () => {

      //Get the images current width and height
      var width = img.width;
      var  height = img.height;

      //Set the WxH to fit the Max values (but maintain proportions)
      if(width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      //create a canvas object
      var canvas = document.createElement("canvas");

      //Set the canvas to the new calculated dimensions
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, width, height);

      let image = canvas.toDataURL();
      let splitParts = image.split(",");
      this.logo = splitParts[1];

      //callback with the results
      callback(this.logo, img.src.length, this.logo.length);
    };
  }

  imageToBase64(url, callback) {
    let img = new Image();
    let base64:string;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      let dataURL = canvas.toDataURL("image/jpg");

      callback(dataURL);
    };

    img.src = url;
  }

  imgToBase64(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob'
    xhr.onload = function () {
      var reader =new FileReader();
      reader.onloadend = function () {
        callback(reader.result.replace('text/xml', 'image/jpeg'));
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
  }
}
