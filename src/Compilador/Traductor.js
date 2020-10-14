import { Tipo_Instruccion } from './Instrucciones.js';
import { Tipo_Operacion } from './Instrucciones.js';
import { Tipo_Valor } from './Instrucciones.js';
import {Simbolos, CodeTxt} from '../scripts/mainScript.js'

const _ = require('lodash')

//AST modificado que se regresara si hay funciones anidadas
let AST,Code;
let PunteroH,PunteroP
let ContadorT,ContadorL

/**
 * Crea un símbolo
 * @param id ID del simbolo
 * @param tipo Tipo de Dato
 * @param valor Valor del simbolo
 * @param rol Rol del simbolo
 */
function crearSimbolo(id,tipo,valor,rol) {
    return {
        ID: id,
        Tipo: tipo,
        Valor:valor,
        Rol:rol
    }
}

class TablaSimbolos {

    /**
     * El constructor recibe una tabla la simbolos de su ambito.
     * @param {*} simbolos 
     */
    constructor (simbolos) {
        this.simbolos=[]
        simbolos.forEach(element => {
            this.simbolos.push(element)
        });
    }

    /**
     * Crea un símbolo
     * @param id ID del simbolo
     * @param tipo Tipo de Dato
     * @param valor Valor del simbolo
     * @param rol Rol del simbolo
     * @param tipo2 Tipo para hacer verificacion
     */
    nuevoSimbolo(id,tipo,rol,valor,tipo2) {
        let simbolo = _.filter(this.simbolos,function(simb) {
            return simb.ID===id;
        });
        if(simbolo.length===0){
            if(tipo2===undefined||tipo2===tipo){
                this.simbolos.push(crearSimbolo(id,tipo,valor,rol));
            }
            else{
                throw Error (`Variable ${id} es de tipo ${tipo} no se le puede asignar ${tipo2}`)
            }
        }
        else{
            throw Error("No se puede declarar variable con ID: "+id+", por que ya existe")
        }
        
    }

    /**
     * Funcion  para obtener los símbolos.
     */
    getsimbolos() {
        return this.simbolos;
    }
}

export function Traducir (Instrucciones){
    let GlobalTS = new TablaSimbolos([])
    Code="";
    PunteroH=0
    PunteroP=0
    ContadorT=0
    ContadorL=0
    AST=Instrucciones;
    TraducirBloque(AST,GlobalTS)
    console.log(GlobalTS)
    return generarEncabezado()
}

export function ReturnAST(){
    return AST
}

function TraducirBloque(Instrucciones,TS){


    Instrucciones.forEach(instruccion => {

        try{

            if(instruccion===undefined){
                throw Error("Intruccion Invalida")
            }
            else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_LET){
                LetDecTo3D(instruccion,TS)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_CONST){

            }
            else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_TYPE){

            }
            else if(instruccion.Tipo===Tipo_Instruccion.ASIGNACION){

            }
            else if(instruccion.Tipo===Tipo_Instruccion.MAS_ASIGNACION){

            }
            else if(instruccion.Tipo===Tipo_Instruccion.ASIGNACION_ARR){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.MAS_ASIGNACION_ARR){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.SALIDA){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_IF){
                IfTo3D(instruccion,TS)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_TERNARIO){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_WHILE){
                WhileTo3D(instruccion,TS);
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_DO_WHILE){
                DoWhileTo3D(instruccion,TS)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR){
                ForTo3D(instruccion,TS)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_OF){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_IN){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_SWITCH){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.DECL_FUNCION){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.GRAFICAR){

            }
            else if(instruccion.Tipo===Tipo_Instruccion.CONTINUE){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BREAK){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.RETURN){
                
            }
            else{
                
            }
        }
        catch(e){
            console.error(e.message)
        }
    });
}

/**
 * Traduce una declaracion a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function LetDecTo3D (instruccion,TS){
    let aux; 

    instruccion.ID.forEach((element) => {
        Code+= `//Comienza declaracion de ${element.ID}\n`
        if(element.Valor!==null){
            TS.nuevoSimbolo(element.ID,element.Tipo,"LET",PunteroP,element.Valor.Tipo); 
            aux=traducirValor(element.Valor,TS)      
            Code+= `stack[(int)p] = ${aux};\np=p+1;\n`
        }
        else{
            TS.nuevoSimbolo(element.ID,element.Tipo,"LET",PunteroP,undefined); 
        }
        PunteroP++
        Code+= `//Termina declaracion de ${element.ID}\n`
    });

}

/**
 * Traduce un bloque If-Else a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function IfTo3D (instruccion,TS){

    let newTS = new TablaSimbolos(TS.simbolos)

    let aux = traducirValor(instruccion.ExpresionLogica)
    let EtiquetaTrue=generarEtiqueta()
    let EtiquetaFalse=generarEtiqueta();
    let EtiquetaNext=generarEtiqueta()

    Code+="//Comienza traduccion de IF \n"
    Code+= `if (${aux}) goto ${EtiquetaTrue};\n`
    Code+= `goto ${EtiquetaFalse};\n`

    Code+=`${EtiquetaTrue}:\n`
    Array.isArray(instruccion.InstruccionesIf)?TraducirBloque(instruccion.InstruccionesIf,newTS):TraducirBloque([instruccion.InstruccionesIf],newTS)
    Code+=`goto ${EtiquetaNext};\n`

    Code+=`${EtiquetaFalse}:\n`
    if(instruccion.InstruccionesElse!==undefined){
        Array.isArray(instruccion.InstruccionesElse)?TraducirBloque(instruccion.InstruccionesElse,newTS):TraducirBloque([instruccion.InstruccionesElse],newTS)
    }
    Code+=`goto ${EtiquetaNext};\n`

    Code+="//Termina traduccion de IF\n"

    Code+=`${EtiquetaNext}:\n`
    
}

/**
 * Traduce un bloque While a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function WhileTo3D(instruccion,TS){

    let newTS = new TablaSimbolos(TS.simbolos)
    let EtiquetaBegin=generarEtiqueta()
    let EtiquetaTrue=generarEtiqueta()
    let EtiquetaNext=generarEtiqueta()

    Code+="//Comienza traduccion de While\n"
    Code+=`${EtiquetaBegin}:\n`
    let aux = traducirValor(instruccion.ExpresionLogica)
    Code+= `if (${aux}) goto ${EtiquetaTrue};\n`
    Code+= `goto ${EtiquetaNext};\n`

    Code+=`${EtiquetaTrue}:\n`
    Array.isArray(instruccion.Instrucciones)?TraducirBloque(instruccion.Instrucciones,newTS):TraducirBloque([instruccion.Instrucciones],newTS)
    Code+=`goto ${EtiquetaNext};\n`

    Code+="//Termina traduccion de While\n"

    Code+=`${EtiquetaNext}:\n`

}

/**
 * Traduce un bloque While a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function DoWhileTo3D(instruccion,TS){

    let newTS = new TablaSimbolos(TS.simbolos)
    let EtiquetaBegin=generarEtiqueta()
    let EtiquetaNext=generarEtiqueta()

    Code+="//Comienza traduccion de Do-While\n"
    Code+=`${EtiquetaBegin}:\n`
    Array.isArray(instruccion.Instrucciones)?TraducirBloque(instruccion.Instrucciones,newTS):TraducirBloque([instruccion.Instrucciones],newTS)

    let aux = traducirValor(instruccion.ExpresionLogica)
    Code+= `if (${aux}) goto ${EtiquetaBegin};\n`
    Code+= `goto ${EtiquetaNext};\n`
    Code+="//Termina traduccion de Do-While\n"

    Code+=`${EtiquetaNext}:\n`

}

/**
 * Traduce un bloque For a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function ForTo3D(instruccion,TS){

    let newTS = new TablaSimbolos(TS.simbolos)
    let EtiquetaBegin=generarEtiqueta()
    let EtiquetaTrue=generarEtiqueta()
    let EtiquetaNext=generarEtiqueta()
    Code+="//Comienza traduccion de For\n"
    Array.isArray(instruccion.OperacionInicial)?TraducirBloque(instruccion.OperacionInicial,newTS):TraducirBloque([instruccion.OperacionInicial],newTS)
    Code+=`${EtiquetaBegin}:\n`
    let aux = traducirValor(instruccion.ExpresionLogica)
    Code+= `if (${aux}) goto ${EtiquetaTrue};\n`
    Code+=`${EtiquetaNext}:\n`
    Array.isArray(instruccion.Instrucciones)?TraducirBloque(instruccion.Instrucciones,newTS):TraducirBloque([instruccion.Instrucciones],newTS) 
    Code+= `goto ${EtiquetaBegin};\n`
    Code+="//Termina traduccion de Do-While\n"
    Code+=`${EtiquetaNext}:\n`

}


//FUNCIONES COMPLEMENTARIAS PARA TRADUCIR A 3D

/**
 * Traduce un expresion
 * @param {*} valor Expresion a traducir
 * @param {*} tabla de simbolos
 */
function traducirValor(valor,ts){
    if(valor.Valor!==undefined){
        if(valor.Tipo===Tipo_Valor.STRING){
            let aux = PunteroH
            traducirString(valor.Valor)
            return aux
        }
        else{
            return valor.Valor;
        }
    }
    else if(Array.isArray(valor)){

        if(valor.length===0){
            //return "[]"
        }
        else if(valor[0].ID===undefined){
            //return traducirArray(valor);
        }
        else{
            let aux=PunteroH
            traducirType(valor,ts)
            return aux
        } 
    }
    else if(valor.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
        //return CallFunToString(valor);
    }
    else if(valor.Tipo===Tipo_Instruccion.BLOQUE_TERNARIO){
        //return TernarioToString(valor) 
    }
    else if(valor.OpTipo!==undefined){
        return traducirOperacionBinaria(valor,ts);
    }
    else{
        return valor;
    }
}

/**
 * Traduce una expresion a un string
 * Se incluyen parentesis para indicar la precedencia
 * @param {*} valor Expresion a traducir
 * @param {*} txt String donde concatenara
 */
function traducirOperacionBinaria(valor,ts){
    let OpIzq=traducirValor(valor.OpIzq)
    let OpDer
    if(valor.OpDer!==undefined){
    OpDer=traducirValor(valor.OpDer)
    }
    
    switch(valor.OpTipo){
        case Tipo_Operacion.NEGACION:
            Code+= generarTemporal()+"= -"+OpIzq+";\n"
            return getLastTemporal()
        case Tipo_Operacion.MULTIPLICACION:
            Code+= generarTemporal()+"="+OpIzq+"*"+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.DIVISION:
            Code+= generarTemporal()+"="+OpIzq+"/"+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.SUMA:
            Code+= generarTemporal()+"="+OpIzq+"+"+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.RESTA:
            Code+= generarTemporal()+"="+OpIzq+"-"+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.MODULO:
            Code+= generarTemporal()+"="+OpIzq+"%"+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.POTENCIA:
            return //"("+traducirValor(valor.OpIzq)+"**"+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.DECREMENTO:
            Code+= generarTemporal()+"="+OpIzq+"-1;\n"
            return getLastTemporal()
        case Tipo_Operacion.INCREMENTO:
            Code+= generarTemporal()+"="+OpIzq+"+1;\n"
            return getLastTemporal()
        case Tipo_Operacion.MAYOR_QUE:
            Code+= generarTemporal()+"="+OpIzq+">"+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.MENOR_QUE:
            Code+= generarTemporal()+"="+OpIzq+"<"+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.MAYOR_IGUAL:
            Code+= generarTemporal()+"="+OpIzq+">="+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.MENOR_IGUAL:
            Code+= generarTemporal()+"="+OpIzq+"<="+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.DOBLE_IGUAL:
            Code+= generarTemporal()+"="+OpIzq+"=="+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.NO_IGUAL:
            Code+= generarTemporal()+"="+OpIzq+"!="+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.AND:
            Code+= generarTemporal()+"="+OpIzq+"&&"+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.OR:
            Code+= generarTemporal()+"="+OpIzq+"||"+OpDer+";\n"
            return getLastTemporal()
        case Tipo_Operacion.NOT:
            Code+= generarTemporal()+"= !"+OpIzq+";\n"
            return getLastTemporal()
        case Tipo_Operacion.ATRIBUTO:
            return //traducirValor(valor.OpIzq)+"."+traducirValor(valor.OpDer)
        case Tipo_Operacion.ACCESO_ARR:
            return //traducirValor(valor.OpIzq)+"["+traducirValor(valor.OpDer)+"]"
        default:
    }
}

/**
 * Traduce un type a 3D
 * @param {*} valor Valor del type a traducir
 * @param {*} id Identificador de type
 */
function traducirType(valor,ts,id){
    let aux
    Array.from(valor).forEach(element => {
        aux = traducirValor(element.Valor)
        Code+= `heap[(int)h] = ${aux};\nh=h+1;\n`
        PunteroH++;
    });
}

/**
 * Traducir un array a 3D
 */
function traducirArray(){

}

/**
 * Traducir un string a 3D
 * @param {*} valor Valor del string a traducir
 */
function traducirString(valor){
    Array.from(valor).forEach(element => {
        Code+= `heap[(int)h] = ${element.charCodeAt(0)};\nh=h+1;\n`
        PunteroH++;
    });
    Code+= `heap[(int)h] = -1;\nh=h+1;\n`
    PunteroH++;
}





// FUNCIONES GENERADORAS 


/**
 * Generar un nuevo string para un temporal
 */
function generarTemporal(){
    return "t"+ContadorT++
}
/**
 * Obtiene la ultima etiqueta generada
 */
function getLastTemporal(){
    return "t"+(ContadorT-1)
}

/**
 * Generar un nuevo string para una etiqueta
 */
function generarEtiqueta(){
    return "L"+ContadorL++
}

/**
 * Genera el codigo final con su encabezado
 * @param {*} CodeTxt Codigo a poner en el main
 */
function generarEncabezado(){

    let TempTxt = "#include <stdio.h>\nfloat heap[16384];\nfloat stack[16394];\nfloat p=0;\nfloat h=0;\n"
    TempTxt+="float "
    for(let i=0;i<ContadorT;i++){
        TempTxt+= i+1===ContadorT ? "t"+i+";" : "t"+i+","
    }
    TempTxt += "\nvoid main() {\n"+ Code + "return; \n}"

    return TempTxt

}
