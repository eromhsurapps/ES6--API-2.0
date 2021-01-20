import * as Promise from 'bluebird';

export default class IMGLoader {
    constructor() {
        this.preloadImages = [];
        this.weight = 0; 
        this.totalImages = 0;
        this.images = [];

        //Anima loading 
        this.longitud = 0;
        this.paso = 0;
        this.pasos = 0;
        this.hilo = null;
        this.actual = 0;
        this.ultimo = 0;

        this.multi = (ps,p) => ps * p;

        this.ended = false;

        this.onload = null; //Function;
        this.onEndLoad = null; //Function;
    }

    adder (imgs) {
        this.preloadImages = imgs.map(function(obj){ return obj.url; });
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        this.weight = imgs.map(function(obj){ return obj.bytes; }).reduce(reducer);
        this.totalImages = this.preloadImages.length;
    }

    events (onL, onE) {
        this.onload = onL;
        this.onEndLoad = onE;
    }

    init () {
        this.preload ();     
        this.onStart ();  
        this.configAnima ();
    }

    configAnima () {
        this.longitud = this.totalImages;
        this.pasos = 100/this.longitud;
        this.anima ();
        this.hilo = setInterval(()=>{ this.anima(); }, 25);
    }
    
    anima () {
        if (Math.abs(this.actual - this.end) > .5) {
            this.actual += (this.end-this.actual)/9;
            this.onload (this.actual);
           // console.log ("Animacion del loading ------>" + this.actual);
        } else {
            if (this.ended && (Math.abs(this.actual - 100)< .5)) {
                //console.log ("Ahora si que puede terminar");
                this.endAnima ();
                this.onEndLoad ();
            }
        }
    }   

    endAnima () { clearInterval (this.hilo); }
    
    changeData () {
        this.paso++;
        this.end = this.multi(this.pasos,this.paso);
    }

    onStart () {

    }

    onAsset () {
        this.changeData ();
        //console.log("Progress", (this.images.length / this.totalImages));
    }

    onEnd () {
        this.changeData ();
        this.ended = true;
        //console.log("Ended", (this.images.length / this.totalImages));
    }

    preload (){
        if (this.preloadImages.length) {
            this.loadImage(this.preloadImages.shift()).then((img) => {
            //console.log("Preload ", img);
            this.imageReady(img);
            })
        }
    }

    imageReady(img) {
        this.images.push(img);
        if ( (this.images.length / this.totalImages) != 1) {
            this.onAsset ();
            this.preload();
        } else {
            this.onEnd ();
        }
    }
    
    loadImage(src) {
        return new Promise((resolve, reject)=> {
        //console.log(src);
        var img = new Image();
        img.onload = ()=> resolve(img);
        img.src = src;
        });
    }
}
