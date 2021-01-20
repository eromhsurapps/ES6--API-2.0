import { info } from "./utils/utilities";

export default class Rushmore {
    
    constructor() {
		this.resiActivated = false;
		this.resizers = new Array ();
	}

	create (ele, all) {
		let obj = (!all)?document.querySelector(ele):document.querySelectorAll(ele);
		Rushmore.DIVS.push ({nombre: ele, objeto: obj});
		return obj;
	}

	activateResize () { window.addEventListener('resize',(e)=>{this.resize()}); }

	resize () { 
		let o_, s_;
		for (let r=0; r<Rushmore.resizers.length; r++) {
			o_ = Rushmore.resizers[r]; 
			s_ = (o_.s!="")?o_.s:this;
			o_.m.call (s_);
		}
	}
	
	addResizer (method_, scope) {
		if (!Rushmore.resiActivated ) {
			Rushmore.resiActivated = true;
			this.activateResize ();
		}
		Rushmore.resizers.push ({m: method_, s: (scope)?scope:""});
	}

	
	static getElement(o) {	//by name
		let obj = Rushmore.DIVS.find(obj => obj.nombre == o);
		return (obj)?obj:false;
	}
	
	static get allElements() {	return Rushmore.DIVS; }

	static globalInfoSet (key, value) {
		let defineProp = function (obj, key, value) {
			var config = {
			    value: value,
			    writable: true,
			    enumerable: true,
			    configurable: true
			  };
			Object.defineProperty( obj, key, config );
		}
		defineProp (info, key, value);
	}

	static globalInfoGet (nameprop) {
		let p_;
		for (let prop in info) {
			if (nameprop == prop) {
				p_ = prop;
				break;
			}
		}
		return info[p_];
	}    

	static globalInfoAll () {
		return info;
	}
}

Rushmore.DIVS = [];
Rushmore.resizers = [];
Rushmore.resiActivated = false;
