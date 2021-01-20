import Rushmore from "../Rushmore";
import { eD as eleDOM } from '../eleDOM.js';

class DialogBox {

    constructor() {
        this.rush_ = new Rushmore ();
        this.rush_.addResizer (this.onresize, this);
        this.dialog = this.rush_.create ("#dialog");
        this.closeDial = this.rush_.create ("#closeDial");
        this.messageDial  = this.rush_.create ("#messageDial");

        this.closeDial.addEventListener('click', (e) => {this.fadeOut () });
    }

    writeMSG (t) {
        this.messageDial.innerHTML = t;
        this.onresize ();
    }

    fadeOut(){
       var d = this.dialog;
       eleDOM.setStyles(d, {opacity: 1});
        (function fade() {
          var val = eleDOM.getStyle (d, "opacity");
          if ((val -= .1) < 0) {
            eleDOM.setStyles(d, {visibility: "hidden"});
          } else {
            eleDOM.setStyles(d, {opacity: val});
            requestAnimationFrame(fade);
          }
        })();
    }
      
    fadeIn(){
        var d = this.dialog;
        eleDOM.setStyles(d, {opacity: 0});
        (function fade() {
          var val = parseFloat(eleDOM.getStyle (d, "opacity"));
          if (!((val += .1) > 1)) {
            eleDOM.setStyles(d, {opacity: val, visibility: "visible"});
            requestAnimationFrame(fade);
          }
        })();
    }    

    onresize () {
      let t_ = this.messageDial.scrollHeight;
      eleDOM.setStyles(this.messageDial, {top: Number (-t_/2)});
    }

}

export default new DialogBox();

