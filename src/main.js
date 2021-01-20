require("es6-symbol/implement");

//Para extender
import Rushmore from "./Rushmore";

//Eventos, CSS & Attr
//import { eBus as EventBus } from './eventbus.js';
import EventBus from './eventbus.js';
import DialogBox from './utils/DialogBox.js';

//Secciones
import loading from "./sections/loading";
import scrollAjaxSection from "./sections/scrollAjaxSection";
import elementSection from "./sections/elementSection";
import camThreshold from "./sections/camThreshold";
import masking from "./sections/masking";

import Navigation from "./Navigation";
import TweenMax from "gsap/TweenMaxBase";

import { eD as eleDOM } from './eleDOM.js';

class main extends Rushmore {

    constructor() {
      super ();

      window.addEventListener("beforeunload", function (event) {
        window.scrollTo(0, 0);
        event.preventDefault();
      });

      this.numerosecciones = 4;
      this.percens = 100/this.numerosecciones;

      this.allscr = null;
      
      EventBus.on(EventBus.events.ENDLOADING, this.goto, this);
      EventBus.on(EventBus.events.RIGUP, this.slideTo, this);

      /*
        Definicion de los elementos
      */
      this.createElements ();
      this.createEvents ();

      /* 
          Instancia del Loading 
      */
      this.loading_ = new loading ();
      this.loading_.init ();

      
      /* 
          Instacia de la del Scroll y la llamada de Ajax - SECCION 1
      */
      this.scrollAjaxSection_ = new scrollAjaxSection();

      /*
        Instanciamos seccion de CSS: Update Set Get - SECCION 2
      */
      this.elementSection_ = new elementSection();

      /*
        Instanciamos seccion de threshold effect Camera - SECCION 3
      */
      this.camThreshold_ = new camThreshold();

      /*
        Instanciamos seccion de mascaracon forma masking - SECCION 4
      */
      this.masking_ = new masking();


      /*
        Navegacion del mini site en horizontal
      */
      this.nav_ = new Navigation ();
      this.nav_.assignSections ([
        this.scrollAjaxSection_,
        this.elementSection_,
        this.camThreshold_,
        this.masking_
      ]);
    }
  
    /*  Creacion de los elementos htmls a usar */
    createElements () { this.allscr = this.create ("#scrAllCont"); }
    createEvents () { this.addResizer (this.onresize, this); }

    onresize (f) {
      //console.log (this);
      console.log ("Resizando main desde Rushmore Class");
    }

    /*
        Goto Sec slider and stop all secctions resources 
    */
    //Va desde que termina el loading a la seccion inicial que le digamos
    goto () { this.nav_.gotoFromOut (4); }

    //Cada vez que pasamos de una seccion a otra con el slider, para los recursos necesarios de las seccion que no estan en uso
    onChangeStop () {
      //Close Dialog box if opened
      DialogBox.fadeOut ();

      //Stop thredsold if running
      this.camThreshold_.stpThold ();
    }

    //Slide a la seccion que toque segun el menu.
    slideTo (e, n_, c_) {
      this.onChangeStop ();

      let per = 100*(n_-1);
      TweenMax.to (this.allscr, 1,{ left:String("-"+per+"%"), ease:Quad.easeInOut });
      EventBus.emit(EventBus.events.RIGUPED);
    }
}

let main_ = new main ();

