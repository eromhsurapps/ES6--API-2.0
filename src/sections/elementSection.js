import Rushmore from "../Rushmore";

//Tween GASP y AJAX call
import {TweenMax, TimelineLite} from "gsap/TweenMax";
import { myRequest } from "../utils/utilities";

//EleDom para trabajr coon el.
import { eD as eleDOM } from '../eleDOM.js';

//Dialogbox para escribir los css del div
import DialogBox from '../utils/DialogBox.js';

export default class elementSection extends Rushmore {
    constructor() {
        super ();
        
        this.div_input_ = null;
        this.input_ = null;
        this.btn_input_ = null;

        this.select = null;

        this.divCSS = null;

        this.showbot = null;
        this.hidebot = null;
        this.setcssbot = null;

        this.createElements ();
        this.createEvents ();

        this.cssType = "left";
    }

    createElements () {
        this.div_input_ = this.create ("#div_input");
        this.input_ = this.create ("#miinput");
        this.btn_input_ = this.create ("#btn_input");
        
        this.select = this.create('.estilos');

        this.divCSS = this.create('#divCSS');

        this.showbot = this.create('#showbot');
        this.hidebot = this.create('#hidebot');
        this.setcssbot = this.create('#setcssbot'); 

    }

    createEvents () {
        this.btn_input_.addEventListener ("click", function () {  this.setStyle (); }.bind(this));
        this.select.addEventListener('change', (event) => { this.cssType = event.target.value; });

        this.showbot.addEventListener('click', (e) => {this.showhide ("s") });
        this.hidebot.addEventListener('click', (e) => {this.showhide ("h") });

        this.setcssbot.addEventListener('click', (e) => {this.writeCSS () });
    }

    showhide (sh) {
        if (sh == "s") eleDOM.show (this.divCSS);
        if (sh == "h") eleDOM.hide (this.divCSS);
    }

    writeCSS () { 
        let t_ = "";
        if (this.cssType == "left" || this.cssType == "top" || this.cssType == "width" || this.cssType == "height") {
            t_ = "El "  + String(this.cssType)  + " es " + String(eleDOM.getStyle (this.divCSS, String (this.cssType)));
            DialogBox.writeMSG (t_);
        } else {
             if (this.cssType == "rota") {
                 t_ = "La rotacion es " + String(eleDOM.getStyle (this.divCSS, "transform")); 
                 DialogBox.writeMSG (t_);
             }
             if (this.cssType == "bgcolor") {
                 t_ =  "El colorr de fondo es " + String(eleDOM.getStyle (this.divCSS, "background-color"));
                 DialogBox.writeMSG (t_);
             }
        } 

        DialogBox.fadeIn ();
    }

    setStyle () {
        let dato_ = this.input_.value;
        let obj = {};

        if (dato_ == "") return;

        if (this.cssType == "left" || this.cssType == "top" || this.cssType == "width" || this.cssType == "height" || this.cssType == "rota") {
            if (isNaN(Number(dato_))) console.log ("El valor tiene que ser un numero");
            else {
                if (this.cssType != "rota") obj[String(this.cssType)] = dato_;
                else obj["transform"] = "rotate(" + String(dato_) + "deg)"; 
            }
        } else {
            if (this.cssType == "bgcolor") {
                if (dato_.length != 6) console.log ("Solo se permite alfanumerico de 6 digitos");
                else obj["background-color"] = "#" + String (dato_);
            }
        }
        
        eleDOM.setStyles(this.divCSS, obj);
    }

}




/*

console.log(eleDOM.getComputedStyles (this.call));

eleDOM.setStyles (this.call, {left: 100, top: 300});
console.log(eleDOM.getStyle (this.call, "left"));
console.log(eleDOM.getStyle (this.call, "top"));
console.log(eleDOM.getStyle (this.call, "x"));
eleDOM.hide (this.call);

console.log (eleDOM.getPageSize);
console.log (eleDOM.getPageSize ());

eleDOM.setStyles (this.call, {left: 100, top: 300});
console.log(eleDOM.getStyle (this.call, "left"));
console.log(eleDOM.getStyle (this.call, "top"));
console.log(eleDOM.getStyle (this.call, "x"));
eleDOM.hide (this.call);

console.log (eleDOM.getPageSize);
console.log (eleDOM.getPageSize ());
*/