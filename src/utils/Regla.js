
export default class Regla {
    constructor (i,f,d) {
        this.ini = 0;
        this.fin = 0;
        this.div = 0;
        this.regla = 0;	
        
        this.newData(i,f,d);
    }
    
    get_hallar (b) { return Math.abs(b-this.ini)/this.regla; }

    newData  (i, f, d) {
        this.ini = i ;
	    this.fin = f ;
	    this.div = d ;
        this.regla = Math.abs(this.fin - this.ini) / this.div;
    }
}
