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
            if(tipo2===undefined||tipo2===Tipo_Valor.ID||tipo2===tipo){
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
     * Actualiza el valor de un simbolo
     * @param id ID del simbolo a actualizar
     * @param valor Objeto {Valor:..,Tipo:..}
     */
    actualizar(id, valor) {

        let simbolo = _.filter(this.simbolos,function(simb) {
            return simb.ID===id;
        });
        simbolo=simbolo[0]

        if(simbolo.rol==="CONST"&&!simbolo.Tipo.includes("ARR")){    
            throw Error("No se puede cambiar el valor de la constante "+simbolo.ID)
        }

        else if (simbolo!==undefined) {
            simbolo.Valor=valor
        }

        else {
            throw new Error("Error : variable " + id + " no ha sido definida")
        }
    }

    /**
     * Obtiene el valor de un símbolo
     * @param id 
     */
    getValor(id) {

        let simbolo = _.filter(this.simbolos,function(simb) {
            return simb.ID===id;
        });
        simbolo=simbolo[0]
        if (simbolo){
            return simbolo
        }
        throw new Error ("Error : variable " + id + " no ha sido definida")
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
    AST=JSON.parse(JSON.stringify(Instrucciones))
    BuscarDec(AST,GlobalTS)
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
                ConstDecTo3D(instruccion,TS)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_TYPE){
                TypeDecExecute(instruccion,TS)
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
                ConsoleLogTo3D(instruccion,TS)
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
 * Hace la primera pasada para econtrar declaraciones
 * @param {*} Instrucciones 
 * @param {*} TablaSimbolos
 */
function BuscarDec(Instrucciones,TablaSimbolos){
    let auxArr=[];
    Instrucciones.forEach(instruccion => {
    try{
        if(instruccion===undefined){
            //throw new Error("Intruccion Invalida")
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_LET){
            LetDecTo3D(instruccion,TablaSimbolos)
            auxArr.push(instruccion)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_CONST){
            ConstDecTo3D(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_TYPE){
            TypeDecExecute(instruccion,TablaSimbolos);
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECL_FUNCION){
            //FunDecExecute(instruccion,TablaSimbolos)
        }
        
    }
    catch(e){
        console.error(e)
    }
    });

    auxArr.forEach((ins)=>{
        _.remove(Instrucciones,function(element){
            return JSON.stringify(ins)===JSON.stringify(element)
        });
    });

    console.log(Instrucciones)
}

/**
 * Traduce una salida a consola a 3D
 */
function ConsoleLogTo3D(instruccion,TS){
    if(instruccion.Valor.Valor!==undefined){
        if(instruccion.Valor.Tipo===Tipo_Valor.STRING){
            Array.from(instruccion.Valor.Valor).forEach(element => {
                Code+=`printf("%c", (char)${element.charCodeAt(0)});\n`
            });
            Code+=`printf("\\n");\n`
        }
        else if(instruccion.Valor.Tipo===Tipo_Valor.ID){
            let auxSimb=TS.getValor(instruccion.Valor.Valor)
            if(auxSimb.Tipo===Tipo_Valor.STRING){
                Code+=`auxPtr=stack[(int)${auxSimb.Valor}];\n`
                Code+='printString();\n'
            }
            else if(auxSimb.Tipo===Tipo_Valor.BOOLEAN){
                Code+=`auxTemp=stack[(int)${auxSimb.Valor}];\n`
                Code+='printBoolean();\n'
            }
            else{
                Code+=`auxTemp=stack[(int)${auxSimb.Valor}];\n`
                Code+='printNumber();\n'
            }
        }
        else if(instruccion.Valor.Tipo===Tipo_Valor.BOOLEAN){
            Code+=`printf("${instruccion.Valor.Valor}");printf("\\n");\n`
        }
        else{
            Code+=`printf("%f", (float)${instruccion.Valor.Valor});printf("\\n");\n`
        }
    }
}

//DECLARACIONES Y ASIGNACIONES

/**
 * Traduce una declaracion LET a 3D
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
            if(Array.isArray(aux)){   
                let auxArr=[]
                aux.forEach((element)=>{
                    auxArr.push(PunteroP)
                    Code+= `stack[(int)p] = ${element};\np=p+1;\n`
                    PunteroP++
                });
                TS.actualizar(element.ID,auxArr)
            }
            else{
                Code+= `stack[(int)p] = ${aux};\np=p+1;\n`
                PunteroP++
            } 
        }
        else{
            TS.nuevoSimbolo(element.ID,element.Tipo,"LET",PunteroP,undefined); 
            PunteroP++
        }
        Code+= `//Termina declaracion de ${element.ID}\n`
    });

}

/**
 * Traduce una declaracion CONST a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function ConstDecTo3D (instruccion,TS){
    let aux; 

    instruccion.ID.forEach((element) => {
        Code+= `//Comienza declaracion de ${element.ID}\n`
        if(element.Valor!==null){
            TS.nuevoSimbolo(element.ID,element.Tipo,"CONST",PunteroP,element.Valor.Tipo); 
            aux=traducirValor(element.Valor,TS)   
            if(Array.isArray(aux)){   
                let auxArr=[]
                aux.forEach((element)=>{
                    auxArr.push(PunteroP)
                    Code+= `stack[(int)p] = ${element};\np=p+1;\n`
                    PunteroP++
                });
                TS.actualizar(element.ID,auxArr)
            }
            else{
                Code+= `stack[(int)p] = ${aux};\np=p+1;\n`
                PunteroP++
                if(element.Tipo===Tipo_Valor.BOOLEAN||element.Tipo===Tipo_Valor.NUMBER){
                    TS.actualizar(element.ID,aux)
                }
            } 
        }
        else{
            TS.nuevoSimbolo(element.ID,element.Tipo,"CONST",PunteroP,undefined); 
            PunteroP++
        }
        Code+= `//Termina declaracion de ${element.ID}\n`
    });

}

/**
 * Ejecuta la declaracion de un type
 * @param {*} instruccion 
 * @param {*} ts 
 */
function TypeDecExecute(instruccion,TS){
    //Se declara Type
    TS.nuevoSimbolo(instruccion.ID,undefined,"TYPE",instruccion.Attrib)
}

/**
 * Ejecuta una sentencia de asignacion
 * @param {*} instruccion 
 * @param {*} ts 
 */
function AsigTo3D(instruccion,ts){
    
}

// CONTROL DE FLUJO

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

// CICLOS

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
    //VALOR PUNTUALES Y UNITARIOS 
    if(valor.Valor!==undefined){
        if(valor.Tipo===Tipo_Valor.STRING){
            let aux = PunteroH
            traducirString(valor.Valor)
            return aux
        }
        else if(valor.Tipo===Tipo_Valor.BOOLEAN){
            if(valor.Valor){
                return 1
            }
            else{
                return 0
            }
        }
        else if(valor.Tipo===Tipo_Valor.ID){
            let auxSimb=ts.getValor(valor.Valor)
            if(auxSimb.Tipo===Tipo_Valor.STRING){
                Code+= generarTemporal()+`=stack[(int)${auxSimb.Valor}];\n`
                return getLastTemporal()
            }
            else{
                Code+= generarTemporal()+`=stack[(int)${auxSimb.Valor}];\n`
                return getLastTemporal()
            }
        }
        else{
            return valor.Valor
        }
    }
    else if(Array.isArray(valor)){

        if(valor.length===0){
            //return "[]"
        }
        else if(valor[0].ID===undefined){
            return traducirArray(valor)
        }
        else{            
            return traducirType(valor,ts)
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

    }
}

/**
 * Traduce una expresion a un string
 * Se incluyen parentesis para indicar la precedencia
 * @param {*} valor Expresion a traducir
 * @param {*} txt String donde concatenara
 */
function traducirOperacionBinaria(valor,ts){


    let OpIzq=traducirValor(valor.OpIzq,ts)
    let OpDer
    if(valor.OpDer!==undefined){
    OpDer=traducirValor(valor.OpDer,ts)
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
            Code+= `auxNum1=${OpIzq};\n`
            Code+= `auxNum2=${OpDer};\n`
            Code+= `potencia();\n`
            Code+= generarTemporal()+"=auxNum3;\n"
            return getLastTemporal()
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
function traducirType(valor,ts){
    let auxArr = []
    let aux 
    Array.from(valor).forEach(element => {
        auxArr.push(PunteroH)
        aux = traducirValor(element.Valor,ts)
        if(Array.isArray(aux)){   
            auxArr.pop()
            auxArr.push(aux)
        }
        else if(element.Valor.Tipo!==Tipo_Valor.STRING){
            Code+= `heap[(int)h] = ${aux};\nh=h+1;\n`
            PunteroH++;
        } 
    });
    return auxArr
}

/**
 * Traducir un array a 3D
 */
function traducirArray(valor,ts){
    let auxArr = []
    let aux 
    valor.forEach(element => {
        auxArr.push(PunteroH)
        aux = traducirValor(element.Valor,ts)
        if(Array.isArray(aux)){
            auxArr.pop()
            auxArr.push(aux)
        }
        else if(element.Valor.Tipo!==Tipo_Valor.STRING){
            Code+= `heap[(int)h] = ${aux};\nh=h+1;\n`
            PunteroH++;
        }    
    });
    return auxArr
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

/**
 * Separa una suma en sus operandos
 * Esta funcion se usa para las salidas de consola
 */
function flatSuma(suma){


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

    let TempTxt = `#include <stdio.h>
float heap[16384];
float stack[16394];
float p=0;
float h=0;
float auxPtr,auxTemp; 
int auxNum1,auxNum2,auxNum3,auxNum4; 
void printString();
void printNumber();
void printBoolean();
void potencia();
`
    if(ContadorT>0){
        TempTxt+="float ";
        for(let i=0;i<ContadorT;i++){
            TempTxt+= i+1===ContadorT ? "t"+i+";" : "t"+i+","
        }
    }
    TempTxt += `
void main(){

${Code}
return;
}`

    TempTxt += `
    
void printString(){

    S0:
        auxTemp=heap[(int)auxPtr];
        if(auxTemp!=-1) goto S1;
        goto S2;
    
    S1:
        printf("%c", (char)auxTemp);
        auxPtr=auxPtr+1;
        goto S0;
    S2:
        printf("\\n");
        return ;

}
void printNumber(){

    printf("%f", (float)auxTemp);
    printf("\\n");
    return ;
}
void printBoolean(){

    if(auxTemp==0) goto R0;
    goto R1;
    R0:
    printf("false \\n");
    goto R2;
    R1:
    printf("true \\n");
    R2:
    return ;
}
void potencia(){

    auxNum4=1;
    auxNum3=auxNum1;
    R0:
    if(auxNum4<auxNum2) goto R1;
    goto R2;
    
    R1:
    auxNum3 = auxNum3*auxNum1;
    auxNum4 = auxNum4+1;
    goto R0;
    
    R2:
    return ;
}
`

    return TempTxt

}
