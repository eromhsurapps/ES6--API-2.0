import Rushmore from "../Rushmore";

class threshold extends Rushmore {

  constructor() {
      super ();

      this.image2TS = this.create ("#original");
      this.outputCanvas = document.getElementById('output');
      this.ctx =  this.outputCanvas.getContext('2d');

      this.Filters = { 
        threshold: function(pixels, threshold) {
          var d = pixels.data;
          for (var i=0; i<d.length; i+=4) {
              var r = d[i];
              var g = d[i+1];
              var b = d[i+2];
              var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
              d[i] = d[i+1] = d[i+2] = v
          }
          return pixels;
        }
      }

      this.loadImage ('img/nico.jpg').then(function (img) { this.imgLoaded (img); }.bind(this));
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.addEventListener('load', e => resolve(img));
      img.addEventListener('error', () => {
        reject(new Error(`Failed to load image's URL: ${url}`));
      });
      img.src = url;
    });
  }

  imgLoaded (image) {
        const imageDataObj = this.getImageData(this.image2TS);
        //console.log("Pixels: type '%s', %d bytes, %d x %d, data: %s...", typeof(imageDataObj.data), imageDataObj.data.length, imageDataObj.width, imageDataObj.height, imageDataObj.data.slice(0, 10).toString());
        const results = this.thresholdImage(imageDataObj);
        this.displayFilteredImage(this.ctx, results.newImageData);
        //console.log ('Filtered image in ' + results.duration + ' msec');
  }

  getImageData(image) {
      const tempCanvas = document.createElement('canvas'), tempCtx = tempCanvas.getContext('2d');
      
      tempCanvas.width = image.width;
      tempCanvas.height = image.height;
      tempCtx.drawImage(image, 0, 0, image.width, image.height);
      const imageDataObj = tempCtx.getImageData(0, 0, image.width, image.height);

      return imageDataObj;
  }

  thresholdImage(pixelData) {
      const thresholdLevel = 235,    // 0-255
      tstart = new Date().getTime();
      const newImageDataObj = this.Filters.threshold(pixelData, thresholdLevel);
      const duration = new Date().getTime() - tstart;
      console.log("Filter image: %d msec", duration);
      return {newImageData: newImageDataObj, duration: duration};
  }

  displayFilteredImage(ctx, newPixelData) {
      const tstart = new Date().getTime();
      ctx.putImageData(newPixelData, 0, 0);
      console.log("Render filtered image: %d msec", (new Date().getTime() - tstart));
  }

}

let threshold_ = new threshold ();
