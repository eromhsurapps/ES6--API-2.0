import Rushmore from "../Rushmore";
import { windowsize } from "../utils/utilities";
import { eD as eleDOM } from '../eleDOM.js';
import { isMobileDevice } from "../utils//utilities";


export default class camThreshold extends Rushmore {

    constructor() {
      super ();

      let w_ = (isMobileDevice())?1080:1400;
      let h_ = (isMobileDevice())?1720:1080;

      this.aspect = {w:w_, h:h_};

      this.corners = {left: 0, top: 0, width:0, height:0};

      // Set constraints for the video stream
      this.constraints = { video: { facingMode: "user" }, audio: false };

      // Define constants
       this.cameraView = this.create("#camera--view");
      // Access the device camera and stream to cameraView

      this.containerTHRE = this.create ("#containerTHRE");
      this.thredDic = this.create ("#thredDic");

      //Buttons starters
      this.strCamera_ = this.create ("#strCamera");
      this.strCamera_.addEventListener('click', (e) => { this.strCamera () });

      this.strThershold_ = this.create ("#strThershold");
      this.strThershold_.addEventListener('click', (e) => { this.strThold () });

      this.TSStarted = false;
      
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
    }

    strCamera () {
      this.cameraStart ();
    }

    strThold () {
      clearInterval (this.hiloINTE);
      this.strInterval ();
      eleDOM.show (this.thredDic);
      eleDOM.hide (this.strThershold_);
    }

    stpThold () {
      if (this.TSStarted) eleDOM.show (this.strThershold_);
      eleDOM.hide (this.thredDic);
      clearInterval (this.hiloINTE);
    }
     
    strInterval () { this.hiloINTE = setInterval(()=>{ this.draw(); }, 50); }

    cameraStart() {
      navigator.mediaDevices
          .getUserMedia(this.constraints)
          .then(function(stream) {
            
            eleDOM.hide (this.strCamera_);
            eleDOM.show (this.strThershold_);

            this.TSStarted = true;

            this.cameraView.srcObject = stream;
        }.bind(this))
          .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
    }

    resize () {
      let expanded = true;

      /*
      let dW_ = windowsize().w;
      let dH_ = windowsize().h;	
      */

      let dW_ = parseInt(this.containerTHRE.getBoundingClientRect().width);
      let dH_ = parseInt(this.containerTHRE.getBoundingClientRect().height);	
      
      let x_ = 1;
      let y_ = 1;
      
      let proportions = this.calculateAspectRatioFit(this.aspect.w,this.aspect.h,dW_,dH_);
      
      if (dW_ != proportions.width && dH_ != proportions.height) return;
      else {
        if (dW_ != proportions.width) {
          //console.log ("una");
          let newh_;
          newh_ = (expanded)?(dW_*proportions.height)/proportions.width:dH_;
          
          this.corners.width = dW_
          this.corners.height = newh_;
          this.corners.left = x_;
          this.corners.top = y_ - (Math.abs(newh_-dH_)/2);
        } else {
          if (dH_ != proportions.height) {
            //console.log ("otra");
            let neww_;
            neww_ = (expanded)?(dH_*proportions.width)/proportions.height:dW_;

            this.corners.width = neww_
            this.corners.height = dH_;
            this.corners.left = x_ - (Math.abs(neww_-dW_)/2);
            this.corners.top = y_;
          } 
        }
      }
    }

    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: srcWidth*ratio, height: srcHeight*ratio };
    }	
  
    draw (image) {
          this.resize ();

          this.thredDic.style.left = String(this.corners.left + "px");
          this.thredDic.style.top = String(this.corners.top + "px");
          this.thredDic.style.width = String(this.corners.width + "px");
          this.thredDic.style.height = String(this.corners.height + "px");

          this.outputCanvas.width = this.corners.width
          this.outputCanvas.height = this.corners.height

          const imageDataObj = this.getImageData();
          //console.log("Pixels: type '%s', %d bytes, %d x %d, data: %s...", typeof(imageDataObj.data), imageDataObj.data.length, imageDataObj.width, imageDataObj.height, imageDataObj.data.slice(0, 10).toString());
          const results = this.thresholdImage(imageDataObj);
          this.displayFilteredImage(this.ctx, results.newImageData);
    }
  
    getImageData(image) {
      
        const tempCanvas = document.createElement('canvas'), tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.clearRect (0, 0, this.corners.widthh, this.corners.height);
        tempCanvas.width = this.corners.width;
        tempCanvas.height = this.corners.height;
        tempCtx.drawImage(this.cameraView, 0, 0, this.corners.width, this.corners.height);
        const imageDataObj = tempCtx.getImageData(0, 0, this.corners.width, this.corners.height);
  
        return imageDataObj;
    }
  
    thresholdImage(pixelData) {
        const thresholdLevel = 95,    // 0-255
        tstart = new Date().getTime();
        const newImageDataObj = this.Filters.threshold(pixelData, thresholdLevel);
        const duration = new Date().getTime() - tstart;
        return {newImageData: newImageDataObj, duration: duration};
    }
  
    displayFilteredImage(ctx, newPixelData) {
        const tstart = new Date().getTime();
        ctx.clearRect(0, 0, this.corners.widthh, this.corners.height);
        ctx.putImageData(newPixelData, 0, 0);
    }
    
}










