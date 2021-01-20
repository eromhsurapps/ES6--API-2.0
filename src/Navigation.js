//import { eBus as EventBus } from './eventbus.js';
import EventBus from './eventbus.js';

const { default: Rushmore } = require("./Rushmore");

class Navigation extends Rushmore{
    constructor () {
        super ();

        this.IEpolyfill ();

        EventBus.on(EventBus.events.RIGUPED, this.riguped, this);
        this.riguping = false;
        this.aT = -1;
        this.aS = -1;
        this.aEle = null;

        this.numSecs = 0;
        /*
            Definicion de los botones del menu
        */
        this.name = "Navigation";
        this.allNav = null;
        this.arrowNav = null;

        this.createElements ();
        this.createEvents ();
    }
       
    createElements () {
        this.allNav = this.create(".navCss li", "all");
        this.numSecs = this.allNav.length;
        
        this.arrowL = this.create("#arrowL");
        this.arrowD = this.create("#arrowD");
    }

    createEvents () {
        this.allNav.forEach(ele => {
            let clicked = (e)=>{ this.goTo (e, ele); };
            // touchend
            ele.addEventListener("touchend",clicked.bind(this), false);
            ele.addEventListener("click",clicked.bind(this), false);
        });
        
        this.arrowL.addEventListener("touchend",(e)=>{ this.nextprev ("izq"); }, false);
        this.arrowL.addEventListener("click", (e)=>{ this.nextprev ("izq"); }, false);

        this.arrowD.addEventListener("touchend",(e)=>{ this.nextprev ("dcha"); }, false);
        this.arrowD.addEventListener("click",(e)=>{ this.nextprev ("dcha"); }, false); 
    }    

    assignSections () {
        
    }

    nextprev (to) {
        let sr = (to=="izq")?-1:1;
        let np = this.aS+sr;

        if (np == 0 || np > this.numSecs) {
            return;
        }
        this.gotoFromOut (np);
    }

    gotoFromOut (n) {
        let ele = document.querySelectorAll('[data-numS="' + String (n)  + '"]')[0];
        this.goTo (null, ele);
    }

    goTo (e, ele) {
        if (this.riguping) return;
        this.riguping = true;

        let f_ = ele.getAttribute ("data-numS");
        if (f_ != this.aT) {
            this.clear ();
            ele.classList.replace("offSec", "onSec");

            this.aS  = Number (ele.getAttribute ("data-numS")); 
            this.aT = Number (ele.getAttribute ("data-numS"));

            EventBus.emit(EventBus.events.RIGUP, this, Number(f_), ele.getAttribute ("data-class"));

            this.setNextPrev ();
        } else {
            this.riguped ();
            //console.log ("ya estas en la seccion " + ele.getAttribute ("data-class"));
        }
    }  

    setNextPrev () {
        if (this.aS-1 == 0) {
            this.arrowL.classList.replace("onArrow","offArrow");
            this.arrowD.classList.replace("offArrow","onArrow");  
        } else {
            if (this.aS+1 > this.numSecs) {
                this.arrowD.classList.replace("onArrow","offArrow"); 
                this.arrowL.classList.replace("offArrow","onArrow");
            } else {
                this.arrowD.classList.replace("offArrow","onArrow"); 
                this.arrowL.classList.replace("offArrow","onArrow");
            }
         }
    }

    clear () {
        this.allNav.forEach(ele => { ele.classList.replace("onSec","offSec"); });
    }

    riguped () { this.riguping = false; }

    IEpolyfill () {
        if ('NodeList' in window && !NodeList.prototype.forEach) {
            // Para el for (.. of ..)
            NodeList.prototype.forEach = function (callback, thisArg) {
                thisArg = thisArg || window;
                for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
                }
            };

            // Para el classlist.replace
            DOMTokenList.prototype.replace = function (a, b) {
                var arr = Array(this);
                var regex = new RegExp(arr.join("|").replace(/ /g, "|"), "i");
                if (!regex.test(a)) {
                    return this;
                }
                this.remove(a);
                this.add(b);
                return this;
            }
        } 
    }    
}

export default Navigation;




