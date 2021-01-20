import Rushmore from "../Rushmore";

//Tween GASP y AJAX call
import {TweenMax, TimelineLite} from "gsap/TweenMax";
import { myRequest } from "../utils/utilities";

//Loader, Scroll y DialogBox
import IMGLoader from "../utils/IMGLoader"
import rushmoreScroll from "../utils/rushmoreScroll";
import DialogBox from '../utils/DialogBox.js';

import { eD as eleDOM } from '../eleDOM.js';


export default class scrollAjaxSection extends Rushmore {
    constructor() {
        super ();

        /*
            Definicion de elementos html
        */
        //botones de llamada AJAX
        this.call = null;
        this.write = null; 

        //Scroll de Javi
        this.alldrag = null;
        
        this.createElements ();
        this.createEvents ();
        
        /* 
          Instancia del scroll  
        */
        this.miscroll = null;
        this.createScroll ();
    }

    createElements () {
    /* DIVS del Scroll */
    this.drag1 = this.create ("#drag1");
    this.posDrag1 = this.create ("#posDrag1");

    /* DIVS de LLAMADAS al json y Escribir el JSON */
    this.call = this.create ("#call");
    this.write = this.create ("#write");
    }

    createEvents () {
    this.call.addEventListener ("click", function () { this.getJson (); }.bind(this));
    this.write.addEventListener ("click", function () { this.writeData(); }.bind(this));
    }

    /* 
        
        Creacion del Scroll 
        
    */
    createScroll () {
        this.miscroll = new rushmoreScroll (this.drag1, {obj: this.posDrag1});
    }

    /* 
    
    Llamada al json 
    
    */
    getJson () {
        myRequest({url: "json/employees.json"})
        .then(data => {
            let emp = JSON.parse(data);

            let names = {};
            let c = 1;
            emp.forEach(emp => { 
            names["trab"+ String(c)] = emp.firstName;
            c++;
            });
            Rushmore.globalInfoSet("Trabajadores", names);

            let phone = {};
            let p = 1;
            emp.forEach(emp => { 
            phone["telf"+ String(p)] = emp.phone;
            p++;
            });
            Rushmore.globalInfoSet("Telefonos", phone);

            this.activateWriter ();
        })
        .catch(error => {
            console.log(error);
        });
    }

    activateWriter () {
        eleDOM.show (this.write);
        // eleDOM.toggle (this.write);
        //eleDOM.setStyles (this.write, {visibility: "visible"});
        TweenMax.to (this.write ,1, {opacity:1, ease:Quad.easeOut });
    }

    /* Escribir el resultado del json en el div */
    writeData () {
        let t_ = Rushmore.globalInfoGet("Trabajadores");
        if (!t_) return;

        //console.log (Rushmore.globalInfoAll ());

        let s_ ="";
        Object.keys(t_).forEach(key => {
        let value = t_[key];
        s_+=String(value) + ", ";
        });
        
        DialogBox.writeMSG ("Los nombres de los trabajadores son: " + s_);
        DialogBox.fadeIn ();
    }    

    init () {
        console.log ("iniciamos la seccion1");
    }

}