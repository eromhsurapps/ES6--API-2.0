import Rushmore from "../Rushmore";
import * as Promise from 'bluebird';
import { windowsize } from "../utils/utilities";
import { eD as eleDOM } from '../eleDOM.js';
import { isMobileDevice } from "../utils/utilities";
import TweenMax from "gsap/TweenMaxBase";


export default class masking extends Rushmore {

    constructor() {
      super ();

      this.enter=false;
      this.opened=false;
  
      this.initW=700;
      this.initH=394;
  
      this.width_= 700;
      this.height_=394;
  
      this.curve_percen= 27;
  
      this.canvas= null;
      this.ctx= null;
    
      this.img=null;
  
      this.ld= {x:0,y:0};
      this.lc= {x:0,y:0};
  
      this.rd= {x:0,y:0};
      this.rc= {x:0,y:0};
      
      this.canvas =  document.getElementById('c');
      this.ctx = this.canvas.getContext('2d');

      this.div = this.create ("#maskDiv");

	  let rute = "img/color.jpg";
	  this.img = document.createElement('IMG');
	  this.img.src = rute;
	  this.loadImage(rute);

      this.resize ( windowsize().w*.6);

      //this.initSquare ("open");
      //this.closeSquare ();

      this.initSquare ("close");
	  this.openSquare ();
	  
	  this.opMask_ = this.create ("#opMask");
	  this.opMask_.addEventListener("click", (e)=>{ this.openSquare (); }, false);

	  this.clMask_ = this.create ("#clMask");
	  this.clMask_.addEventListener("click", (e)=>{ this.closeSquare (); }, false);	  

	  this.addResizer (this.onresize, this);
    }

	onresize () {
		let w_ = windowsize().w*.6;
		this.resize (w_);
	}

    activate () {
       this.enter = true;
       this.maskIt ();
    }

    loadImage(src) {
      return new Promise((resolve, reject)=> {
		this.activate ();
      	var img = new Image();
      	img.onload = ()=> resolve(img);	
      	img.src = src;
      });
	}
	  
	resize (W_) {
		this.width_ = W_;
		this.height_ = (W_*this.initH)/this.initW;

		this.canvas.width = W_;
		this.canvas.height = this.height_;

		TweenMax.set (this.div, {width: W_});
		TweenMax.set (this.div, {height: this.height_});

		this.img.width = W_;
		this.img.height = this.height_;

		var percen = (W_*this.curve_percen)/ 100;

		this.lc.x = percen;
		this.rc.x = W_-percen;

		this.maskIt ();
	}

	initSquare (oc) {
		if (oc == "close") {
			this.ld.y = this.height_;
		
			this.lc.y = this.height_;
			this.rc.y = this.height_;
		
			this.rd.y = this.height_;
			
			this.opened = false;
		} else {
			this.ld.y = 0;
		
			this.lc.y = 0;
			this.rc.y = 0;
		
			this.rd.y = 0;
			
			this.opened = true;
		}
		this.maskIt ();			
	}	

	openSquare () {
		let update_ = (e)=>{  this.animate (); };
		let complete_  = (e)=>{  this.opened = true; };

		TweenMax.to (this.ld, 1.5, {y: 0 , ease:Quad.easeInOut, onUpdate: update_ });
		TweenMax.to (this.lc, 1.5, { delay:.1,  y: 0 , ease:Expo.easeInOut, onUpdate: update_, onComplete: complete_ });
	}

	closeSquare () {
		let update_ = (e)=>{  this.animate (); };
		let complete_  = (e)=>{  this.opened = false; };

		TweenMax.to (this.ld, 1.5, {y: this.height_ , ease:Quad.easeInOut, onUpdate: update_ });
		TweenMax.to (this.lc, 1.5, { delay:.1,  y: this.height_ , ease:Expo.easeInOut, onUpdate: update_, onComplete: complete_ });
		this.animate ();
	}

	animate () {
		this.rd.y = this.ld.y;
		this.rc.y = this.lc.y;
		this.maskIt ();
	}
	
	maskIt () {
		if (!this.enter) return;

		this.ctx.clearRect(0, 0, this.width_, this.height_);
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.ld.y);
		this.ctx.bezierCurveTo(this.lc.x, this.lc.y, this.rc.x, this.rc.y, this.width_, this.rd.y);
		this.ctx.lineTo(this.width_, this.height_);
		this.ctx.lineTo(0, this.height_);
		this.ctx.closePath();
		this.ctx.clip();
		this.ctx.drawImage(this.img, 0, 0, this.width_, this.height_);
		this.ctx.restore();
	}
}
