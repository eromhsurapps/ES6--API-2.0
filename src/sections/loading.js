import IMGLoader from "../utils/IMGLoader";
import Rushmore from "../Rushmore";

//import { eBus, eBus as EventBus } from "../eventbus";
import EventBus from '../eventbus.js';
import { eD as eleDOM } from '../eleDOM.js';

export default class loading extends IMGLoader{
    constructor() {
        super ();

        this.rush_ = new Rushmore ();

        //Loading texto y la tapa del site
        this.tapa = null;
        this.loadDiv = null;

        this.createElements ();

        //this.imgload.events (this.onLoad.bind(this), this.onEndLoad.bind(this));
        this.adder ([
          {url: "img/nico.jpg", bytes: 116000},
          {url: "img/dubai.jpg", bytes: 3460000},
          {url: "img/sanjordi.jpg", bytes: 38000}
        ]);

        this.onload = function (c) {
            this.loadDiv.innerHTML = ("Cargado " + String(Math.ceil(c)) + "%");
        }.bind(this);

        this.onEndLoad = function () {
            TweenMax.to(this.tapa ,1, {opacity:0, ease:Quad.easeOut });
                TweenMax.to(this.loadDiv ,1, {opacity:0, ease:Quad.easeOut, onComplete: function () {
                    eleDOM.hide (this.loadDiv);
                    eleDOM.hide (this.tapa);

                    EventBus.emit (EventBus.events.ENDLOADING); 
                }.bind (this)});
        }.bind (this);
    }

    createElements () {
        this.tapa = this.rush_.create ("#tapa");
        this.loadDiv = this.rush_.create ("#loadDiv");
    }
}