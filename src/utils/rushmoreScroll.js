const WheelIndicator = require('wheel-indicator');

import Rushmore from "../Rushmore";
import Regla from "./Regla";
import displace from 'displacejs';
import { isMobileDevice } from "./utilities";
import { windowsize } from "./utilities";

import * as Hammer from 'hammerjs';

export default class rushmoreScroll {
    
    constructor (alldr, fxTF) {
        //Elementos
        this.alldr = alldr;

        this.bounds = this.alldr.querySelector(".boundsSCR");
        this.dragdrop = this.alldr.querySelector(".dragdropSCR");
        this.container = this.alldr.querySelector(".containerSCR");
        this.texto = this.alldr.querySelector(".textoSCR");

        this.toWrite = document.querySelector("#toWrite");

        //Normalizacion para scroll del contenido
        this.rscr = new Regla (1,1,1);
        this.history_boundsH = 0;

        this.styleTop = 0;
        
        //Parametros de tamaños de la barra dragdrop
        this.ini_contH = 500;
        this.ini_ddH = 50;
        this.history_ddH = 0;

        //Config DRAG&DROP
        this.options = {
            constrain: true,
            relativeTo: this.bounds,

            onMouseDown: this.strSCR.bind(this),
            onMouseUp: this.stpSCR.bind(this),
            onMouseMove: this.moveSCR.bind(this)
        };
        this.drdisplace = displace(this.dragdrop, this.options);

        this.hilo = null;
        this.stopit = true;

        /* responive_scroll */
        this.top = {l:0, t:0 };
        this.bottom = {l:0, t:0 };
        
        this.fix2What = fxTF;
        this.fixDiv = null;
        this.fix2Window = false;
        this.fix2Div = false;

        if (this.fix2What.obj instanceof Window) {
            //console.log ("es window");
            this.fix2Window = true;
            this.fix2Div = false;
        } else {
            //console.log ("es div");
            this.fix2Window = false;
            this.fix2Div = true;
            this.fixDiv = this.fix2What.obj;
        }

        this.velocityRule = new Regla (0,1500,15);
        this.indicator = new WheelIndicator({
            elem: this.alldr,
            //callback: this.wheelController(e).bind(this)
            callback: (e)=>{ this.wheelController (e); }
          });

        //window.addEventListener('resize', function () { console.log (this); });
        //window.addEventListener('resize', this.resize(() => console.log('hello'), 200, false));
        //window.onresize = this.resize.bind(this);
        window.addEventListener('resize', () => this.resize()); // <- can't remove

        if (isMobileDevice()) {
            let mc = new Hammer(this.alldr);
            this.vy = 0;
            this.hilofrena = null;
            this.outofboundUp = false;
            this.outofboundDown = false;
            this.dir = 0;
            mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
            mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
            mc.get('press').set({ time: 1 });
            mc.on("panup pandown", Hammer.bindFn(this.touchMoving, this));
            mc.on("swipe", Hammer.bindFn(this.touchSwipe, this));

            this.bounds.style.display = "none";
            this.dragdrop.style.display = "none";
        }

        this.resize ();
    }

    touchMoving (ev) {
         //this.toWrite.innerHTML = ev.direction;
         //console.log ("velocidad mientras muevo con el dedo: " + ev.velocityY*10); 

         let actTop = this.texto.offsetTop;
         actTop+= (ev)?ev.velocityY*10:1;
         
         let scrPos = Math.abs(actTop) + this.container.getBoundingClientRect().height

         if (actTop > 0) {
            this.outofboundUp = true;
            actTop=0;
         } else {
             if (this.texto.scrollHeight - scrPos < 0) {
                this.outofboundDown = true;
                actTop=(-this.texto.scrollHeight+this.container.getBoundingClientRect());
             } else {
                 this.outofboundUp = false;
                 this.outofbounddown = false;
             }
         }
         this.texto.style.top = String(actTop + "px");
    }

    touchSwipe (ev) {  
        this.vy += ev.velocityY * 20;
        //this.toWrite.innerHTML = "velocidad al soltar: " + this.vy;
        //console.log ("velocidad al soltar: " + this.vy);
        if (this.vy < 0) this.dir = -1;
        else this.dir = 1;

        this.strFrena ();
    }

    strFrena () {
        clearInterval (this.hilofrena);
        this.hilofrena = setInterval(()=>{ this.frena(); }, 30); 
    }

    frena () {
        let actTop = this.texto.offsetTop;
        let end = actTop + this.vy;

        let acel = 2
        if (this.dir < 0) {
            if (this.vy + acel < 0)  this.vy =  this.vy+acel;
            else this.vy = 0;
        } else {
            if (this.vy - acel > 0) this.vy =  this.vy-acel;
            else this.vy = 0;
        }

        if ((this.vy == 0)) { clearInterval (this.hilofrena); }

        let scrPos = Math.abs(end) + this.container.getBoundingClientRect().height
        if (end > 0) {
            end=0;
            this.vy = 0;
            clearInterval (this.hilofrena);
         } else {
             if (this.texto.scrollHeight - scrPos < 0) {
                end=(-this.texto.scrollHeight+this.container.getBoundingClientRect().height);
                this.vy = 0;
                clearInterval (this.hilofrena);
             } 
         }

        this.texto.style.top = String(end + "px");
    }

    wheelController (e) {
       let boundH_ = this.bounds.getBoundingClientRect().height; 
       let velo_ = 0;
       let difH_ = this.texto.scrollHeight-boundH_;
       difH_ = (difH_<0)?0:(difH_>1500)?1500:difH_;
       velo_ = this.velocityRule.get_hallar (difH_);
       
       //console.log ("DIF_" + difH_);
       //console.log ("VELO_" + velo_);
       
        let suma = 0;
        suma = boundH_/velo_;

        let dir = e.direction
        let act = this.dragdrop.offsetTop;
        let nextP = 0;

        if (dir == "up") {
            act-=suma;
            nextP = act;
            if (nextP < 0) act = 0;
        } else {
            act+=suma;
            nextP = act;
            let h_ = parseInt(this.dragdrop.getBoundingClientRect().height);
            if ((nextP+h_) > boundH_) act = boundH_-h_;
        }
        
        let boundsWH = this.bounds.getBoundingClientRect();

        let n_ = Math.round((boundsWH.height*act)/this.history_boundsH);
        this.dragdrop.style.top = String (n_ + "px");
        
        this.strSCR ();
        this.moveSCR ();
        this.stpInterval ();
    }

    resize () {
        if (this.fix2Window) {
            this.top.t = 10;
            this.bottom.t = (windowsize().h-10);
        } else {
            if (this.fix2Div) {
                this.top.l = this.fixDiv.offsetLeft;
                this.top.t = this.fixDiv.offsetTop;
                
                this.bottom.l = this.fixDiv.offsetLeft;
                this.bottom.t = this.fixDiv.offsetTop + this.fixDiv.getBoundingClientRect().height;

                this.alldr.style.width = String(this.fixDiv.getBoundingClientRect().width + "px");
                
                this.alldr.style.left = String(this.top.l + "px");
                this.alldr.style.top = String(this.top.t + "px");
                
                this.container.style.width = String(this.fixDiv.getBoundingClientRect().width + "px");
                this.texto.style.width = String(this.fixDiv.getBoundingClientRect().width-21 + "px");
            }
        }
        
        for (let fx=0;fx<2;fx++)this.responsive ();

        if (isMobileDevice) {
            setTimeout(()=>{ this.touchMoving(); }, 100); 
        }
    }

    //Configuracion de la regla para el scroll del texto
    reconfig () {
        let boundsWH = this.bounds.getBoundingClientRect(); 
        let textoWH = this.texto.getBoundingClientRect();
        let dragdropWH = this.dragdrop.getBoundingClientRect();

        this.history_boundsH = boundsWH.height;

        this.rscr.newData (0,boundsWH.height-dragdropWH.height,this.texto.scrollHeight-boundsWH.height);
    }

    //Llamada al iniciar y cada vez que se modifica el tamaño del contenido o el container
    responsive () {
        this.alldr.style.top = String(this.top.t + "px");

        let h_ = Math.abs(this.top.t - this.bottom.t);
        this.alldr.style.height = String(h_ + "px");

        this.container.style.height = String(h_ + "px");
        this.bounds.style.height = String(h_ + "px");
        
        let barH = ((this.alldr.getBoundingClientRect().height*this.ini_ddH)/this.ini_contH);
        this.dragdrop.style.height = String (barH+"px");
        
        this.drdisplace.reinit ();

        this.dragdropSet ();

        if (this.hider ()) {
            this.bounds.style.display = "none";
            this.dragdrop.style.display = "none";
            this.texto.style.top = "0px";
        } else {
            if (!isMobileDevice()) {
                this.bounds.style.display = "block";
                this.dragdrop.style.display = "block";
            }
        }
    }

    dragdropSet () {
        let act = this.dragdrop.offsetTop;
        let boundsWH = this.bounds.getBoundingClientRect();

        let n_ = Math.round((boundsWH.height*act)/this.history_boundsH);

        this.drdisplace.destroy ();
        this.dragdrop.style.top = String (n_ + "px");
        this.history_boundsH = boundsWH.height;

        let h_def = this.dragdrop.getBoundingClientRect().height;
        let t_def = this.dragdrop.offsetTop;

        let def_ = (boundsWH.height)-h_def;

        if ((t_def + h_def)> boundsWH.height) { this.dragdrop.style.top = String (def_+"px"); }

        this.drdisplace = displace(this.dragdrop, this.options);
        this.reconfig ();
        this.moveSCR ();
        this.moveIt ();

        this.stpSCR ();
        clearInterval (this.hilo);
    }

    hider () { return (this.texto.scrollHeight>=this.container.getBoundingClientRect().height)?false:true; }
    moveSCR () {  this.styleTop = (this.rscr.get_hallar (this.dragdrop.offsetTop))*-1; }
    moveIt () { this.texto.style.top = String(this.styleTop + "px"); }
    strSCR () { this.strInterval (); }
    
    stpSCR () { 
        this.moveSCR ();
        this.stpInterval (); 
    }  

    strInterval () { 
        this.stopit = false;
        clearInterval (this.hilo);
        this.hilo = setInterval(()=>{ this.interval(); }, 30); 
    }

    stpInterval () { this.stopit = true; }

    interval () {
        //console.log ("intervaling");

        let actTop = this.texto.offsetTop;
        actTop+= (this.styleTop-actTop)/3;
        this.texto.style.top = String(actTop + "px");

        if (Math.abs(this.styleTop-actTop) < 2.1 && this.stopit) {
            this.stopit = false;
            clearInterval ( this.hilo);
        }
    }
}
