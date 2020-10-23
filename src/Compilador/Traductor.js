import { Tipo_Instruccion } from './Instrucciones.js';
import { Tipo_Operacion } from './Instrucciones.js';
import { Tipo_Valor } from './Instrucciones.js';
import {Simbolos, CodeTxt, Console} from '../scripts/mainScript.js'
import { param } from 'jquery';

const _ = require('lodash')

//AST modificado que se regresara si hay funciones anidadas
let AST,Code,CodeFun,CodeDec;
let ContadorT,ContadorL,ContadorA,ContadorB
let GlobalTS

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
            if(tipo2===undefined||tipo2===Tipo_Valor.ID||tipo2===tipo||tipo2===Tipo_Valor.NULL||tipo2===Tipo_Instruccion.LLAMADA_FUNCION){
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
    GlobalTS = new TablaSimbolos([])
    Code="";
    CodeFun=""
    CodeDec=""
    ContadorT=0
    ContadorL=0
    ContadorA=0;
    ContadorB=0;
    AST=JSON.parse(JSON.stringify(Instrucciones))
    //BuscarDec(AST,GlobalTS)
    TraducirBloque(AST,GlobalTS)
    console.log(GlobalTS)
    return generarEncabezado()
}

export function ReturnAST(){
    return AST
}

function TraducirBloque(Instrucciones,TS,EtiquetaBegin,EtiquetaNext,FunObj){


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
                AsigTo3D(instruccion,TS)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.MAS_ASIGNACION){

            }
            else if(instruccion.Tipo===Tipo_Instruccion.ASIGNACION_ARR){
                AsigArrTo3D(instruccion,TS)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.MAS_ASIGNACION_ARR){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
                FunCallTo3D(instruccion,TS);
            }
            else if(instruccion.Tipo===Tipo_Instruccion.SALIDA){
                ConsoleLogTo3D(instruccion,TS)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_IF){
                IfTo3D(instruccion,TS,EtiquetaBegin,EtiquetaNext,FunObj)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_TERNARIO){
                
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_WHILE){
                WhileTo3D(instruccion,TS,FunObj);
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_DO_WHILE){
                DoWhileTo3D(instruccion,TS,FunObj)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR){
                ForTo3D(instruccion,TS,FunObj)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_OF){
                ForOfTo3D(instruccion,TS,FunObj)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_IN){
                ForInTo3D(instruccion,TS,FunObj)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_SWITCH){
                SwitchTo3D(instruccion,TS,EtiquetaBegin,FunObj)
            }
            else if(instruccion.Tipo===Tipo_Instruccion.DECL_FUNCION){
                DecFunTo3D(instruccion,TS);
            }
            else if(instruccion.Tipo===Tipo_Instruccion.CONTINUE){
                Code+=`goto ${EtiquetaBegin};\n`
            }
            else if(instruccion.Tipo===Tipo_Instruccion.BREAK){
                Code+=`goto ${EtiquetaNext};\n`
            }
            else if(instruccion.Tipo===Tipo_Instruccion.RETURN){
                if(FunObj!==undefined){
                    if(instruccion.Valor!==undefined){
                        let val=getValor(instruccion.Valor,TS)
                        Code+=`stack[(int)${FunObj.Puntero}]=${val.Valor};\n`
                        Code+=`goto ${FunObj.Etiqueta};\n`
                    }
                    else{
                        Code+=`goto ${FunObj.Etiqueta};\n`
                    }
                }
                else{
                    //No esta adentro de funcion
                }
            }
            else if(instruccion.OpTipo===Tipo_Operacion.DECREMENTO||instruccion.OpTipo===Tipo_Operacion.INCREMENTO){
                IncDecTo3D(instruccion,TS)
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
                Code+=`auxPtr=${auxSimb.Valor};\n`
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
            Code+=`printf("%f", (double)${instruccion.Valor.Valor});printf("\\n");\n`
        }
    }
    else{
        let aux = getValor(instruccion.Valor,TS)
        if(aux.Tipo===Tipo_Valor.NUMBER){
            Code+=`auxTemp=${aux.Valor};\n`
            Code+='printNumber();\n'
        }
        else if(aux.Tipo===Tipo_Valor.BOOLEAN){
            Code+=`auxTemp=${aux.Valor};\n`
            Code+='printBoolean();\n'
        }
        else{
            Code+=`auxPtr=${aux.Valor};\n`
            Code+='printString();\n'
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
        if(element.Valor.Tipo!==Tipo_Valor.NULL){   
            aux=traducirValor(element.Valor,TS)
            TS.nuevoSimbolo(element.ID,element.Tipo,"LET",aux.Valor,element.Valor.Tipo);
        }   
        else{
            // FALTA CONTROLAR NULLS
            TS.nuevoSimbolo(element.ID,element.Tipo,"LET",generarTemporal(),undefined);
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
        if(element.Valor.Tipo!==Tipo_Valor.NULL){   
            aux=traducirValor(element.Valor,TS)
            TS.nuevoSimbolo(element.ID,element.Tipo,"CONST",aux.Valor,element.Valor.Tipo);
        }   
        else{
            // FALTA CONTROLAR NULLS
            console.log("dw")
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
function AsigTo3D(instruccion,TS){
    Code+= `//Comienza asignacion de ${instruccion.ID}\n`
    //Se obtiene variable
    let auxSimb=TS.getValor(instruccion.ID)
    let aux=getValor(instruccion.Valor,TS)

    if(auxSimb.Tipo!==Tipo_Valor.NUMBER&&auxSimb.Tipo!==Tipo_Valor.BOOLEAN){
        Code+= `${auxSimb.Valor}=${aux.Valor};\n` 
    }  
    else{   
    Code+= `stack[(int)${auxSimb.Valor}]=${aux.Valor};\n` 
    }
    
    Code+= `//Termina asignacion de ${instruccion.ID}\n`
    
}

/**
 * Ejecuta una sentencia de asignacion a array
 * @param {*} instruccion 
 * @param {*} ts 
 */
function AsigArrTo3D(instruccion,TS){
    Code+='//Comienza asignacion en '+instruccion.ID+"\n"
    //Se obtiene referencia al array
    let arr =TS.getValor(instruccion.ID)
    let val =getValor(instruccion.Valor,TS,true)
    let pos1,pos2;
    if(instruccion.Posicion2===undefined){
        pos1=getValor(instruccion.Posicion,TS)

        let aux=generarTemporal();
        if(arr.Tipo===Tipo_Valor.NUMBER_ARR||arr.Tipo===Tipo_Valor.BOOLEAN_ARR){
            Code+=`${aux}=${arr.Valor}+${pos1.Valor};\n`
            Code+=`${aux}=${aux}+1;\n`
            Code+=`${aux}=heap[(int)${aux}];\n`
            Code+=`heap[(int)${aux}]=${val.Valor};\n`          
        }
        else{
            Code+=`${aux}=${arr.Valor}+${pos1.Valor};\n`
            Code+=`${aux}=${aux}+1;\n`
            Code+=`heap[(int)${aux}]=${val.Valor};\n`
        }

    }
    else{
        pos1=getValor(instruccion.Posicion,TS)
        pos2=getValor(instruccion.Posicion2,TS)

        let aux=generarTemporal();
        if(arr.Tipo===Tipo_Valor.NUMBER_ARR_ARR||arr.Tipo===Tipo_Valor.BOOLEAN_ARR_ARR){
            Code+=`${aux}=${arr.Valor}+${pos1.Valor};\n`
            Code+=`${aux}=${aux}+1;\n`
            Code+=`${aux}=heap[(int)${aux}];\n`

            Code+=`${aux}=${aux}+${pos2.Valor};\n`
            Code+=`${aux}=${aux}+1;\n`
            Code+=`${aux}=heap[(int)${aux}];\n`

            Code+=`heap[(int)${aux}]=${val.Valor};\n`          
        }
        else{
            Code+=`${aux}=${arr.Valor}+${pos1.Valor};\n`
            Code+=`${aux}=${aux}+1;\n`

            Code+=`${aux}=${aux}+${pos2.Valor};\n`
            Code+=`${aux}=${aux}+1;\n`

            Code+=`heap[(int)${aux}]=${val.Valor};\n`
        }

    }
    Code+='//Termina asignacion en '+instruccion.ID+"\n"
}

/**
 * Traduce un operacion de incremento o decremento
 * @param {*} instruccion 
 * @param {*} TS 
 */
function IncDecTo3D(instruccion,TS){
    let auxSimb = TS.getValor(instruccion.OpIzq.Valor)
    if(instruccion.OpTipo===Tipo_Operacion.INCREMENTO){
        Code+=`${generarTemporal()}=stack[(int)${auxSimb.Valor}];\n`
        Code+=`stack[(int)${auxSimb.Valor}]=${getLastTemporal()}+1;\n`
    }
    else{
        Code+=`${generarTemporal()}=stack[(int)${auxSimb.Valor}];\n`
        Code+=`stack[(int)${auxSimb.Valor}]=${getLastTemporal()}-1;\n`
    }
}

/**
 * Traduce una declaracion de funcion a 3D
 * @param {*} instruccion 
 * @param {*} TS 
 */
function DecFunTo3D(instruccion,TS){

    let aux={
        Parametros:instruccion.Parametros,
        Instrucciones:instruccion.Instrucciones,
    }
    GlobalTS.nuevoSimbolo(instruccion.ID,instruccion.TipoRetorno,"FUNCTION",undefined)

    CodeDec+=`void ${instruccion.ID}();\n`
    let functionPtr = generarTemporal();
    let newTS = new TablaSimbolos(TS.simbolos)
    let EtiquetaNext = generarEtiqueta()
    CodeFun+=`void ${instruccion.ID}(){\n\n`
    
    let params = instruccion.Parametros
    let paramText=""
    if(params!==undefined){
    //Este string se usa para asignar y reasignar parametros
        paramText+="//Puntero de la funcion\n"
        paramText+=`${functionPtr}=p;\n`
        paramText+="//Comienza declaracion de parametros\n"
        let auxTemp=generarTemporal();
        params.forEach((element,index)=>{
            paramText+=`${auxTemp}=${functionPtr}+${index+1};\n`
            paramText+=`p=p+1;\n`
            paramText+=`${generarTemporal()}=stack[(int)${auxTemp}];\n`
            newTS.nuevoSimbolo(element.ID,element.Tipo,"LET",getLastTemporal(),undefined);
        });
        paramText+="//Termina declaracion de parametros\n"
        CodeFun+=paramText
    }

    //Objeto para las pinches llamadas recursivas
    let auxObj={ID:instruccion.ID,Puntero:functionPtr,AsigTxt:paramText,Etiqueta:EtiquetaNext}
    //FALTAN DESANIDAMINETO


    //Se traducen instrucciones
    let auxCode = Code;
    Code="";
    Array.isArray(instruccion.Instrucciones)?TraducirBloque(instruccion.Instrucciones,newTS,undefined,EtiquetaNext,auxObj):TraducirBloque([instruccion.Instrucciones],newTS,undefined,EtiquetaNext,auxObj)
    CodeFun+=Code
    Code=auxCode;
    CodeFun+=`${EtiquetaNext}:\n`
    CodeFun+=`return;\n\n}`

    

}

/**
 * Traduce una llamada de funcion a 3D
 * @param {*} instruccion 
 * @param {*} TS 
 */
function FunCallTo3D(instruccion,TS) {
    Code+='//Comienza llamada a funcion\n'
    let fun = GlobalTS.getValor(instruccion.ID)
    let functionPtr = generarTemporal();
    
    
    let params = instruccion.Params
    //Parametros
    if(params!==undefined){
        let auxVal=[]
        let auxTemp=generarTemporal();
        Code+='//Comienza creacion de parametros\n'
        params.forEach((element)=>{
            auxVal.push(traducirValor(element.Valor,TS))
        });
        Code+='//Termina creacion de parametros\n'

        Code+='//Comienza asignacion de parametros en stack\n'
        Code+=`${functionPtr}=p;\n`
        params.forEach((element,index)=>{
            Code+=`${auxTemp}=${functionPtr}+${index+1};\n`
            Code+=`stack[(int)${auxTemp}]=${auxVal[index].Valor};\n`
        });
        Code+='//Termina asignacion de parametros en stack\n'
    }
    Code+=`${fun.ID}();\n`
    let returnVal=generarTemporal();
    Code+=`${returnVal}=stack[(int)${functionPtr}];\n`
    Code+='//Termina llamada a funcion\n'
    console.log(fun)
    return{Valor:returnVal,Tipo:fun.Tipo}
    
}

// CONTROL DE FLUJO

/**
 * Traduce un bloque If-Else a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function IfTo3D (instruccion,TS,EtBegin,EtNext,FunObj){
    let newTS = new TablaSimbolos(TS.simbolos)
    let aux = getValor(instruccion.ExpresionLogica,TS)
    let EtiquetaTrue=generarEtiqueta()
    let EtiquetaFalse=generarEtiqueta();
    let EtiquetaNext=generarEtiqueta()

    Code+="//Comienza traduccion de IF \n"
    Code+= `if (${aux.Valor}) goto ${EtiquetaTrue};\n`
    Code+= `goto ${EtiquetaFalse};\n`

    Code+=`${EtiquetaTrue}:\n`
    Array.isArray(instruccion.InstruccionesIf)?TraducirBloque(instruccion.InstruccionesIf,newTS,EtBegin,EtNext,FunObj):TraducirBloque([instruccion.InstruccionesIf],newTS,EtBegin,EtNext,FunObj)
    Code+=`goto ${EtiquetaNext};\n`

    Code+=`${EtiquetaFalse}:\n`
    if(instruccion.InstruccionesElse!==undefined){
        Array.isArray(instruccion.InstruccionesElse)?TraducirBloque(instruccion.InstruccionesElse,newTS,EtBegin,EtNext,FunObj):TraducirBloque([instruccion.InstruccionesElse],newTS,EtBegin,EtNext,FunObj)
    }
    Code+=`goto ${EtiquetaNext};\n`

    Code+="//Termina traduccion de IF\n"

    Code+=`${EtiquetaNext}:\n`
    
}

/**
 * Traduce una sentencia de switch a 3D
 * @param {*} instruccion 
 * @param {*} ts 
 */
function SwitchTo3D(instruccion,ts,EtBegin,FunObj){
    Code+='//Comienza traduccion de Switch\n'
    let aux = getValor(instruccion.Expresion,ts)
    let tempVal
    let EtiquetaNext=generarEtiqueta()
    let tempTrue,auxArr=[]
    instruccion.Casos.forEach((element)=>{
        if(element.Tipo===Tipo_Instruccion.CASO_SWITCH){
            tempVal=getValor(element.CasoExpresion,ts)
            tempTrue=generarEtiqueta()
            Code+=`if(${aux.Valor}==${tempVal.Valor}) goto ${tempTrue};\n`
            auxArr.push(tempTrue)
        }
        else{
            tempTrue=generarEtiqueta()
            Code+=`goto ${tempTrue};\n`
            auxArr.push(tempTrue)
        }
    });
    instruccion.Casos.forEach((element,index)=>{ 
        Code+=`${auxArr[index]}:\n`
        Array.isArray(element.Instrucciones)?TraducirBloque(element.Instrucciones,ts,EtBegin,EtiquetaNext,FunObj):TraducirBloque([element.Instrucciones],ts,EtBegin,EtiquetaNext,FunObj) 
    });
    Code+=`${EtiquetaNext}:\n`
    Code+='//Termina traduccion de Switch\n'
}


// CICLOS

/**
 * Traduce un bloque While a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function WhileTo3D(instruccion,TS,FunObj){

    let newTS = new TablaSimbolos(TS.simbolos)
    let EtiquetaBegin=generarEtiqueta()
    let EtiquetaTrue=generarEtiqueta()
    let EtiquetaNext=generarEtiqueta()

    Code+="//Comienza traduccion de While\n"
    Code+=`${EtiquetaBegin}:\n`
    let aux = getValor(instruccion.ExpresionLogica,TS)
    Code+= `if (${aux.Valor}) goto ${EtiquetaTrue};\n`
    Code+= `goto ${EtiquetaNext};\n`

    Code+=`${EtiquetaTrue}:\n`
    Array.isArray(instruccion.Instrucciones)?TraducirBloque(instruccion.Instrucciones,newTS,EtiquetaBegin,EtiquetaNext,FunObj):TraducirBloque([instruccion.Instrucciones],newTS,EtiquetaBegin,EtiquetaNext,FunObj)
    Code+=`goto ${EtiquetaBegin};\n`

    Code+="//Termina traduccion de While\n"

    Code+=`${EtiquetaNext}:\n`

}

/**
 * Traduce un bloque While a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function DoWhileTo3D(instruccion,TS,FunObj){

    let newTS = new TablaSimbolos(TS.simbolos)
    let EtiquetaBegin=generarEtiqueta()
    let EtiquetaNext=generarEtiqueta()

    Code+="//Comienza traduccion de Do-While\n"
    Code+=`${EtiquetaBegin}:\n`
    Array.isArray(instruccion.Instrucciones)?TraducirBloque(instruccion.Instrucciones,newTS,EtiquetaBegin,EtiquetaNext,FunObj):TraducirBloque([instruccion.Instrucciones],newTS,EtiquetaBegin,EtiquetaNext,FunObj)

    let aux = getValor(instruccion.ExpresionLogica,TS)
    Code+= `if (${aux.Valor}) goto ${EtiquetaBegin};\n`
    Code+= `goto ${EtiquetaNext};\n`
    Code+="//Termina traduccion de Do-While\n"

    Code+=`${EtiquetaNext}:\n`

}

/**
 * Traduce un bloque For a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function ForTo3D(instruccion,TS,FunObj){

    let newTS = new TablaSimbolos(TS.simbolos)
    let EtiquetaBegin=generarEtiqueta()
    let EtiquetaTrue=generarEtiqueta()
    let EtiquetaNext=generarEtiqueta()
    Code+="//Comienza traduccion de For\n"
    Array.isArray(instruccion.OperacionInicial)?TraducirBloque(instruccion.OperacionInicial,newTS):TraducirBloque([instruccion.OperacionInicial],newTS)
    Code+=`${EtiquetaBegin}:\n`
    let aux = getValor(instruccion.ExpresionLogica,newTS)
    Code+= `if (${aux.Valor}) goto ${EtiquetaTrue};\n`
    Code+= `goto ${EtiquetaNext};\n`
    Code+=`${EtiquetaTrue}:\n`
    Array.isArray(instruccion.Instrucciones)?TraducirBloque(instruccion.Instrucciones,newTS,EtiquetaBegin,EtiquetaNext,FunObj):TraducirBloque([instruccion.Instrucciones],newTS,EtiquetaBegin,EtiquetaNext,FunObj) 
    Array.isArray(instruccion.ExpresionPaso)?TraducirBloque(instruccion.ExpresionPaso,newTS):TraducirBloque([instruccion.ExpresionPaso],newTS) 
    Code+= `goto ${EtiquetaBegin};\n`
    Code+="//Termina traduccion de For\n"
    Code+=`${EtiquetaNext}:\n`

}

/**
 * Traduce un bloque For-Of a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function ForOfTo3D(instruccion,TS,FunObj){

    Code+='//Comienza traduccion de For-Of\n'

    let newTS = new TablaSimbolos(TS.simbolos)
    TraducirBloque([instruccion.AuxVar],newTS)
    //Se obtiene variable auxiliar
    let auxVar = newTS.simbolos[newTS.simbolos.length-1]
    //Se obtiene variable a iterar
    let auxArr = traducirValor(instruccion.Var,newTS)
    //Se obtiene length de auxArr
    let length = generarTemporal()
    Code+=`${length}=heap[(int)${auxArr.Valor}];\n`
    //Etiquetas
    let EtiquetaBegin=generarEtiqueta()
    let EtiquetaNext=generarEtiqueta()
    let Iterador=generarTemporal();
    Code+=`${Iterador}=-1;\n`
    Code+=`${EtiquetaBegin}:\n`
    Code+=`${Iterador}=${Iterador}+1;\n`
    Code+=`if(${Iterador}>=${length}) goto ${EtiquetaNext};\n`

    let aux=generarTemporal();
    if(auxArr.Tipo===Tipo_Valor.NUMBER_ARR||auxArr.Tipo===Tipo_Valor.BOOLEAN_ARR){
        Code+=`${aux}=${auxArr.Valor}+${Iterador};\n`
        Code+=`${aux}=${aux}+1;\n`
        Code+=`${aux}=heap[(int)${aux}];\n`
        Code+=`${aux}=heap[(int)${aux}];\n`
        Code+=`stack[(int)${auxVar.Valor}]=${aux};\n`
    }
    else{
        Code+=`${aux}=${auxArr.Valor}+${Iterador};\n`
        Code+=`${aux}=${aux}+1;\n`
        Code+=`${aux}=heap[(int)${aux}];\n`
        Code+=`${auxVar.Valor}=${aux};\n`
    }

            
    Array.isArray(instruccion.Instrucciones)?TraducirBloque(instruccion.Instrucciones,newTS,EtiquetaBegin,EtiquetaNext,FunObj):TraducirBloque([instruccion.Instrucciones],newTS,EtiquetaBegin,EtiquetaNext,FunObj) 
    Code+=`goto ${EtiquetaBegin};\n`
    Code+=`${EtiquetaNext}:\n`

    Code+='//Termina traduccion de For-Of\n'

}

/**
 * Traduce un bloque For-In a 3D
 * @param {*} Instruccion Bloque que contiene la instruccion   
 * @param {TablaSimbolos} TS Tabla de Simbolos
 */
function ForInTo3D(instruccion,TS,FunObj){

    Code+='//Comienza traduccion de For-In\n'

    let newTS = new TablaSimbolos(TS.simbolos)
    TraducirBloque([instruccion.AuxVar],newTS)
    //Se obtiene variable auxiliar
    let auxVar = newTS.simbolos[newTS.simbolos.length-1]
    //Se obtiene variable a iterar
    let auxArr = traducirValor(instruccion.Var,newTS)
    //Se obtiene length de auxArr
    let length = generarTemporal()
    Code+=`${length}=heap[(int)${auxArr.Valor}];\n`
    //Etiquetas
    let EtiquetaBegin=generarEtiqueta()
    let EtiquetaNext=generarEtiqueta()
    let Iterador=generarTemporal();
    Code+=`${Iterador}=-1;\n`
    Code+=`${EtiquetaBegin}:\n`
    Code+=`${Iterador}=${Iterador}+1;\n`
    Code+=`if(${Iterador}>=${length})goto ${EtiquetaNext};\n`
    Code+=`stack[(int)${auxVar.Valor}]=${Iterador};\n`
    
    Array.isArray(instruccion.Instrucciones)?TraducirBloque(instruccion.Instrucciones,newTS,EtiquetaBegin,EtiquetaNext,FunObj):TraducirBloque([instruccion.Instrucciones],newTS,EtiquetaBegin,EtiquetaNext,FunObj) 
    Code+=`goto ${EtiquetaBegin};\n`
    Code+=`${EtiquetaNext}:\n`

    Code+='//Termina traduccion de For-In\n'

}

//FUNCIONES COMPLEMENTARIAS PARA TRADUCIR A 3D

/**
 * Traduce un expresion, se usa para declaraciones y expresiones
 * @param {*} valor Expresion a traducir
 * @param {*} tabla de simbolos
 * @param {*} bool Indica si se va usar el heap 
 * @returns {*} Objeto {Valor:...,Tipo...}
 */
function traducirValor(valor,ts,bool){
    //VALOR PUNTUALES Y UNITARIOS 
    if(valor.Valor!==undefined){
        if(valor.Tipo===Tipo_Valor.STRING){
            return traducirString(valor.Valor)
        }
        else if(valor.Tipo===Tipo_Valor.BOOLEAN){
            if(valor.Valor){
                if(bool){
                    Code+=generarTemporal()+"=h;\n"
                    Code+= `heap[(int)h] = ${1};\nh=h+1;\n`
                    return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN}
                }
                else{
                    Code+=generarTemporal()+"=p;\n"
                    Code+= `stack[(int)p] = ${1};\np=p+1;\n`
                    return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN} 
                }
            }
            else{
                if(bool){
                    Code+=generarTemporal()+"=h;\n"
                    Code+= `heap[(int)h] = ${0};\nh=h+1;\n`
                    return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN}
                }
                else{
                    Code+=generarTemporal()+"=p;\n"
                    Code+= `stack[(int)p] = ${0};\np=p+1;\n`
                    return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN} 
                }
            }
        }
        else if(valor.Tipo===Tipo_Valor.ID){
            let auxSimb=getValor(valor,ts)
            if(auxSimb.Tipo===Tipo_Valor.NUMBER||auxSimb.Tipo===Tipo_Valor.BOOLEAN){
                Code+=generarTemporal()+"=p;\n"
                Code+= `stack[(int)p] = ${auxSimb.Valor};\np=p+1;\n`
                return {Valor:getLastTemporal(),Tipo:auxSimb.Tipo}
                
            }
            else{
                return {Valor:auxSimb.Valor,Tipo:auxSimb.Tipo}
            }
        }
        if(valor.Tipo===Tipo_Valor.NEWARR){

        }
        else{
            if(bool){
                Code+= generarTemporal()+"=h;\n"
                Code+= `heap[(int)h] = ${valor.Valor};\nh=h+1;\n`
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                Code+= generarTemporal()+"=p;\n"
                Code+= `stack[(int)p] = ${valor.Valor};\np=p+1;\n`
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
            }
        }
    }
    else if(Array.isArray(valor)){

        if(valor[0].ID===undefined){
            return traducirArray(valor)
        }
        else{            
            return traducirType(valor,ts)
        } 
    }
    else if(valor.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
        let aux = FunCallTo3D(valor,ts)
        if(aux.Tipo===Tipo_Valor.NUMBER || aux.Tipo===Tipo_Valor.BOOLEAN){
            Code+=generarTemporal()+"=p;\n"
            Code+= `stack[(int)p] = ${aux.Valor};\np=p+1;\n`
        }
        return {Valor:getLastTemporal(),Tipo:aux.Tipo}
    }
    else if(valor.Tipo===Tipo_Instruccion.BLOQUE_TERNARIO){
        //return TernarioToString(valor) 
    }
    else if(valor.OpTipo!==undefined){
        let aux = traducirOperacionBinaria(valor,ts)
        if(aux.Tipo===Tipo_Valor.NUMBER || aux.Tipo===Tipo_Valor.BOOLEAN){
            Code+=generarTemporal()+"=p;\n"
            Code+= `stack[(int)p] = ${aux.Valor};\np=p+1;\n`
        }
        return {Valor:getLastTemporal(),Tipo:aux.Tipo}
    }
    else{

    }
}

/**
 * Traduce un expresion, se usa para operaciones binarias
 * @param {*} valor Expresion a traducir
 * @param {*} tabla de simbolos
 * @returns {*} Objeto {Valor:...,Tipo...}
 */
function getValor(valor,ts){
    //VALOR PUNTUALES Y UNITARIOS 
    if(valor.Valor!==undefined){
        if(valor.Tipo===Tipo_Valor.STRING){
            return traducirString(valor.Valor)
        }
        else if(valor.Tipo===Tipo_Valor.BOOLEAN){
            if(valor.Valor){
                return {Valor:1,Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                return {Valor:0,Tipo:Tipo_Valor.BOOLEAN}
            }
        }
        else if(valor.Tipo===Tipo_Valor.ID){
            let auxSimb=ts.getValor(valor.Valor)
            if(auxSimb.Tipo===Tipo_Valor.STRING){
                Code+= generarTemporal()+`=${auxSimb.Valor};\n`
                return {Valor:getLastTemporal(),Tipo:auxSimb.Tipo}
            }
            else if(auxSimb.Tipo.includes("ARR")){
                return {Valor:auxSimb.Valor,Tipo:auxSimb.Tipo}
            }
            else{
                Code+= generarTemporal()+`=stack[(int)${auxSimb.Valor}];\n`
                return {Valor:getLastTemporal(),Tipo:auxSimb.Tipo}
            }
        }
        else{
            return {Valor:valor.Valor,Tipo:Tipo_Valor.NUMBER}
        }
    }
    else if(Array.isArray(valor)){

        if(valor[0].ID===undefined){
            return traducirArray(valor)
        }
        else{            
            return traducirType(valor,ts)
        } 
    }
    else if(valor.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
        return FunCallTo3D(valor,ts);
    }
    else if(valor.Tipo===Tipo_Instruccion.BLOQUE_TERNARIO){
        //return TernarioToString(valor) 
    }
    else if(valor.OpTipo!==undefined){
        return traducirOperacionBinaria(valor,ts);
    }
    else{
        return ts.getValor(valor)
    }
}

/**
 * Traduce una expresion a un string
 * Se incluyen parentesis para indicar la precedencia
 * @param {*} valor Expresion a traducir
 * @param {*} txt String donde concatenara
 */
function traducirOperacionBinaria(valor,ts){


    let OpIzq=getValor(valor.OpIzq,ts)
    let OpDer
    if(valor.OpDer!==undefined&&valor.OpTipo!==Tipo_Operacion.ATRIBUTO){
    OpDer=getValor(valor.OpDer,ts)
    }
    
    switch(valor.OpTipo){
        case Tipo_Operacion.NEGACION:
            Code+= generarTemporal()+"= -"+OpIzq.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.MULTIPLICACION:
            Code+= generarTemporal()+"="+OpIzq.Valor+"*"+OpDer.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.DIVISION:
            Code+= generarTemporal()+"="+OpIzq.Valor+"/"+OpDer.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.SUMA:
            //NUMBER-NUMBER
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                Code+= generarTemporal()+"="+OpIzq.Valor+"+"+OpDer.Valor+";\n"
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
            }
            //NUMBER-BOOLEAN
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.BOOLEAN){
                Code+= generarTemporal()+"="+OpIzq.Valor+"+"+OpDer.Valor+";\n"
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
            }
            //STRING-STRING
            if(OpIzq.Tipo===Tipo_Valor.STRING && OpDer.Tipo===Tipo_Valor.STRING){
                Code+= `auxNum1=${OpIzq.Valor};\n`
                Code+= `auxNum2=${OpDer.Valor};\n`
                Code+= `concatStrings();\n`
                Code+= generarTemporal()+"=auxNum4;\n"
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.STRING}
            }
            //STRING-NUMBER
            if(OpIzq.Tipo===Tipo_Valor.STRING && OpDer.Tipo===Tipo_Valor.NUMBER){
                Code+= `auxNum1=${OpIzq.Valor};\n`
                Code+= `auxNum2=${OpDer.Valor};\n`
                Code+= `concatStringNumber();\n`
                Code+= generarTemporal()+"=auxNum4;\n"
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.STRING}
            }
            //STRING-BOOLEAN
            if(OpIzq.Tipo===Tipo_Valor.STRING && OpDer.Tipo===Tipo_Valor.BOOLEAN){
                Code+= `auxNum1=${OpIzq.Valor};\n`
                Code+= `auxNum2=${OpDer.Valor};\n`
                Code+= `concatStringBoolean();\n`
                Code+= generarTemporal()+"=auxNum4;\n"
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.STRING}
            }
            return
        case Tipo_Operacion.RESTA:
            Code+= generarTemporal()+"="+OpIzq.Valor+"-"+OpDer.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.MODULO:
            Code+= generarTemporal()+"="+OpIzq.Valor+"%"+OpDer.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.POTENCIA:
            Code+= `auxNum1=${OpIzq.Valor};\n`
            Code+= `auxNum2=${OpDer.Valor};\n`
            Code+= `potencia();\n`
            Code+= generarTemporal()+"=auxNum3;\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.DECREMENTO:
            Code+= generarTemporal()+"="+OpIzq.Valor+"-1;\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.INCREMENTO:
            Code+= generarTemporal()+"="+OpIzq.Valor+"+1;\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.MAYOR_QUE:
            Code+= generarTemporal()+"="+OpIzq.Valor+">"+OpDer.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.MENOR_QUE:
            Code+= generarTemporal()+"="+OpIzq.Valor+"<"+OpDer.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.MAYOR_IGUAL:
            Code+= generarTemporal()+"="+OpIzq.Valor+">="+OpDer.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.MENOR_IGUAL:
            Code+= generarTemporal()+"="+OpIzq.Valor+"<="+OpDer.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
        case Tipo_Operacion.DOBLE_IGUAL:
            //NUMBER-NUMBER
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                Code+= generarTemporal()+"="+OpIzq.Valor+"=="+OpDer.Valor+";\n"
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN}
            }
            //BOOLEAN-BOOLEAN
            if(OpIzq.Tipo===Tipo_Valor.BOOLEAN && OpDer.Tipo===Tipo_Valor.BOOLEAN){
                Code+= generarTemporal()+"="+OpIzq.Valor+"=="+OpDer.Valor+";\n"
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN}
            }
            //STRING-STRING
            if(OpIzq.Tipo===Tipo_Valor.STRING && OpDer.Tipo===Tipo_Valor.STRING){
                Code+= `auxNum1=${OpIzq.Valor};\n`
                Code+= `auxNum2=${OpDer.Valor};\n`
                Code+= `compareStrings();\n`
                Code+= generarTemporal()+"=auxNum5;\n"
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN}
            }
            return getLastTemporal()
        case Tipo_Operacion.NO_IGUAL:
            //NUMBER-NUMBER
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                Code+= generarTemporal()+"="+OpIzq.Valor+"!="+OpDer.Valor+";\n"
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN}
            }
            //BOOLEAN-BOOLEAN
            if(OpIzq.Tipo===Tipo_Valor.BOOLEAN && OpDer.Tipo===Tipo_Valor.BOOLEAN){
                Code+= generarTemporal()+"="+OpIzq.Valor+"!="+OpDer.Valor+";\n"
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN}
            }
            //STRING-STRING
            if(OpIzq.Tipo===Tipo_Valor.STRING && OpDer.Tipo===Tipo_Valor.STRING){
                Code+= `auxNum1=${OpIzq.Valor};\n`
                Code+= `auxNum2=${OpDer.Valor};\n`
                Code+= `compareStrings();\n`
                Code+= generarTemporal()+"=!auxNum5;\n"
                return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN}
            }
            return getLastTemporal()
        case Tipo_Operacion.AND:
            Code+= generarTemporal()+"="+OpIzq.Valor+"&&"+OpDer.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN}
        case Tipo_Operacion.OR:
            Code+= generarTemporal()+"="+OpIzq.Valor+"||"+OpDer.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN}
        case Tipo_Operacion.NOT:
            Code+= generarTemporal()+"= !"+OpIzq.Valor+";\n"
            return {Valor:getLastTemporal(),Tipo:Tipo_Valor.BOOLEAN}
        case Tipo_Operacion.ATRIBUTO:
            OpDer=valor.OpDer
            if(OpDer!=="length"&&OpDer.Tipo!==Tipo_Instruccion.LLAMADA_FUNCION){
                let aux=generarTemporal();
                let index=getPropIndex(OpIzq.Tipo,OpDer,ts)
                
                if(index.Tipo===Tipo_Valor.NUMBER||index.Tipo===Tipo_Valor.BOOLEAN){
                    Code+=`${aux}=${OpIzq.Valor}+${index.Index};\n`
                    Code+=`${aux}=${aux}+1;\n`
                    Code+=`${aux}=heap[(int)${aux}];\n`
                    Code+=`${aux}=heap[(int)${aux}];\n`
                }
                else{
                    Code+=`${aux}=${OpIzq.Valor}+${index.Index};\n`
                    Code+=`${aux}=${aux}+1;\n`
                    Code+=`${aux}=heap[(int)${aux}];\n`
                }
                return {Valor:aux,Tipo:index.Tipo}
            }
            else if(OpDer.ID!==undefined){
                if(OpDer.ID.toUpperCase()==="TOLOWERCASE"){
                    Code+= `auxNum1=${OpIzq.Valor};\n`
                    Code+= `ToLowerCase();\n`
                    Code+= generarTemporal()+"=auxNum3;\n"
                    return {Valor:getLastTemporal(),Tipo:Tipo_Valor.STRING}
                } 
                else if(OpDer.ID.toUpperCase()==="TOUPPERCASE"){
                    Code+= `auxNum1=${OpIzq.Valor};\n`
                    Code+= `ToUpperCase();\n`
                    Code+= generarTemporal()+"=auxNum3;\n"
                    return {Valor:getLastTemporal(),Tipo:Tipo_Valor.STRING}
                } 
            }  
            else{
                if(OpIzq.Tipo.includes("ARR")){
                    Code+=`${generarTemporal()}=heap[(int)${OpIzq.Valor}];\n`
                    return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
                }
                else if(OpIzq.Tipo===Tipo_Valor.STRING){
                    Code+= `auxNum1=${OpIzq.Valor};\n`
                    Code+= `stringLength();\n`
                    Code+= generarTemporal()+"=auxNum3;\n"
                    return {Valor:getLastTemporal(),Tipo:Tipo_Valor.NUMBER}
                }
            }
            return
        case Tipo_Operacion.ACCESO_ARR:           
            let tipo=OpIzq.Tipo.replace("_ARR","")
            let aux=generarTemporal();
            console.log(OpIzq)
            if(OpIzq.Tipo===Tipo_Valor.NUMBER_ARR||OpIzq.Tipo===Tipo_Valor.BOOLEAN_ARR){
                Code+=`${aux}=${OpIzq.Valor}+${OpDer.Valor};\n`
                Code+=`${aux}=${aux}+1;\n`
                Code+=`${aux}=heap[(int)${aux}];\n`
                Code+=`${aux}=heap[(int)${aux}];\n`
            }
            else{
                Code+=`${aux}=${OpIzq.Valor}+${OpDer.Valor};\n`
                Code+=`${aux}=${aux}+1;\n`
                Code+=`${aux}=heap[(int)${aux}];\n`
            }
             
            return {Valor:aux,Tipo:tipo}
            
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
    valor.forEach(element => {      
        aux = traducirValor(element.Valor,ts,true)
        auxArr.push(aux.Valor)    
    });
    let referencia = generarTemporal();
    Code+=`${referencia}=h;\n`
    Code+=`heap[(int)h]=${auxArr.length};\n`
    Code+='h=h+1;\n'
    auxArr.forEach(element=>{
        Code+=`heap[(int)h]=${element};\n`
        Code+='h=h+1;\n'
    });

    return {Valor:referencia,Tipo:"TYPE"}
}

/**
 * Traducir un array a 3D
 */
function traducirArray(valor,ts){
    let auxArr = []
    let aux 
    valor.forEach(element => {      
        aux = traducirValor(element.Valor,ts,true)
        auxArr.push(aux.Valor)    
    });
    let referencia = generarTemporal();
    Code+=`${referencia}=h;\n`
    Code+=`heap[(int)h]=${auxArr.length};\n`
    Code+='h=h+1;\n'
    auxArr.forEach(element=>{
        Code+=`heap[(int)h]=${element};\n`
        Code+='h=h+1;\n'
    });

    return {Valor:referencia,Tipo:"ARR"}
}

/**
 * Traducir un string a 3D
 * @param {*} valor Valor del string a traducir
 */
function traducirString(valor){
    Code+= generarTemporal()+"=h;\n"
    Array.from(valor).forEach(element => {
        Code+= `heap[(int)h] = ${element.charCodeAt(0)};\nh=h+1;\n`
    });
    Code+= `heap[(int)h] = -1;\nh=h+1;\n`
    return{Valor:getLastTemporal(),Tipo:Tipo_Valor.STRING}
}

/**
 * Obtiene el index de un propiedad de un type
 * @param {*} type 
 * @param {*} prop 
 * @returns {*} Object {Index:..,Tipo...}
 */
function getPropIndex(type,prop,ts){
    let aux = _.filter(ts.simbolos,function(simb) {
        return simb.ID===type;
    });
    let aux2;
    aux[0].Valor.forEach((element,index)=>{
        if(element.ID===prop){
            console.log(index)
            aux2={Index:index,Tipo:element.Tipo}
        }
    });
    return aux2;
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
double heap[16384];
double stack[16394];
double stackR[16394];
double p=0;
double h=0;
double auxPtr,auxTemp; 
double auxNum1,auxNum2,auxNum3,auxNum4,auxNum5; 
void printString();
void printNumber();
void printBoolean();
void potencia();
void concatStrings();
void concatStringNumber();
void compareStrings();
void ToLowerCase();
void ToUpperCase();
void stringLength();
void concatStringBoolean();
`
    if(CodeDec.length!==0){
        TempTxt+=CodeDec
    }
    if(ContadorT>0){
        TempTxt+="double ";
        for(let i=0;i<ContadorT;i++){
            TempTxt+= i+1===ContadorT ? "t"+i+";\n" : "t"+i+","
        }
    }
    if(ContadorA>0){
        TempTxt+="double ";
        for(let i=0;i<ContadorA;i++){
            TempTxt+= i+1===ContadorA ? "*a"+i+";\n" : "*a"+i+","
        }
    }
    if(ContadorB>0){
        TempTxt+="double ";
        for(let i=0;i<ContadorB;i++){
            TempTxt+= i+1===ContadorB ? "**b"+i+";\n" : "*b"+i+","
        }
    }
    TempTxt += `
void main(){

${Code}
return;
}

`
    if(CodeFun.length!==0){
        TempTxt+=CodeFun
    }
    TempTxt += `
    
void printString(){

    L0:
        auxTemp=heap[(int)auxPtr];
        if(auxTemp!=-1) goto L1;
        goto L4;
    
    L1:
        if(auxTemp>=199) goto L2;
        if(auxTemp<-1) goto L3;
        printf("%c", (char)auxTemp);
        auxPtr=auxPtr+1;
        goto L0;
    L2:
        auxTemp=auxTemp-200;
        printf("%f", (double)auxTemp);
        auxPtr=auxPtr+1;
        goto L0;
    L3:
        printf("%f", (double)auxTemp);
        auxPtr=auxPtr+1;
        goto L0;
    L4:
        printf("\\n");
        return ;

}
void printNumber(){

    printf("%f", (double)auxTemp);
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
void concatStrings(){
    auxNum4=h;
    
    L0:
    auxNum3=heap[(int)auxNum1];
    if(auxNum3!=-1)goto L1;
    goto L2;
    L1: 
    heap[(int)h]=auxNum3;
    h=h+1;
    auxNum1=auxNum1+1;
    goto L0;
    
    L2:
    auxNum3=heap[(int)auxNum2];
    if(auxNum3!=-1)goto L3;
    goto L4;
    L3: 
    heap[(int)h]=auxNum3;
    h=h+1;
    auxNum2=auxNum2+1;
    goto L2;
    
    L4:
    heap[(int)h]=-1;
    h=h+1;
    return;

}
void concatStringNumber(){
    auxNum4=h;
    
    L0:
    auxNum3=heap[(int)auxNum1];
    if(auxNum3!=-1)goto L1;
    goto L2;
    L1: 
    heap[(int)h]=auxNum3;
    h=h+1;
    auxNum1=auxNum1+1;
    goto L0;
    
    L2:
    if(auxNum2>=-1) auxNum2=auxNum2+200;
    heap[(int)h]=auxNum2;
    h=h+1;
    goto L4;
    
    L4:
    heap[(int)h]=-1;
    h=h+1;
    return;
    
}
void compareStrings(){
    
    L0:
    auxNum3=heap[(int)auxNum1];
    auxNum4=heap[(int)auxNum2];
    auxNum1=auxNum1+1;
    auxNum2=auxNum2+1;
    if(auxNum3==-1)goto L1;
    if(auxNum3==auxNum4)goto L0;
    goto L3;
    
    L1:
    if(auxNum4==-1) goto L2;
    goto L3;
    
    L2:
    auxNum5=1;
    goto L4;
    
    L3:
    auxNum5=0;
    goto L4;
    
    L4:
    return;
    
}
void ToLowerCase(){
    auxNum3=h;
    L0:
    auxNum2=heap[(int)auxNum1];
    auxNum1=auxNum1+1;
    if(auxNum2==-1)goto L4;
    if(auxNum2<91) goto L1;
    goto L3;
    
    L1:
    if(auxNum2>64) auxNum2=auxNum2+32;
    goto L3;
    
    L3:
    heap[(int)h]=auxNum2;
    h=h+1;
    goto L0;
    
    L4:
    return;
}
void ToUpperCase(){
    auxNum3=h;
    L0:
    auxNum2=heap[(int)auxNum1];
    auxNum1=auxNum1+1;
    if(auxNum2==-1)goto L4;
    if(auxNum2<123) goto L1;
    goto L3;
    
    L1:
    if(auxNum2>96) auxNum2=auxNum2-32;
    goto L3;
    
    L3:
    heap[(int)h]=auxNum2;
    h=h+1;
    goto L0;
    
    L4:
    return;
}
void stringLength(){
    auxNum3=0;
    L0:
    auxNum2=heap[(int)auxNum1];
    auxNum1=auxNum1+1;
    if(auxNum2==-1)goto L3;
    goto L2;
    
    L2:
    auxNum3=auxNum3+1;
    goto L0;
    
    L3:
    return;
}
void concatStringBoolean(){
    auxNum4=h;
    
    L0:
    auxNum3=heap[(int)auxNum1];
    if(auxNum3!=-1)goto L1;
    goto L2;
    L1: 
    heap[(int)h]=auxNum3;
    h=h+1;
    auxNum1=auxNum1+1;
    goto L0;
    
    L2:
    if(auxNum2==0)goto L3;
    goto L4;
    
    L3: 
    heap[(int)h] = 102;
    h=h+1;
    heap[(int)h] = 97;
    h=h+1;
    heap[(int)h] = 108;
    h=h+1;
    heap[(int)h] = 115;
    h=h+1;
    heap[(int)h] = 101;
    h=h+1;
    heap[(int)h] = -1;
    h=h+1;
    goto L5;
    
    L4:
    heap[(int)h] = 116;
    h=h+1;
    heap[(int)h] = 114;
    h=h+1;
    heap[(int)h] = 117;
    h=h+1;
    heap[(int)h] = 101;
    h=h+1;
    heap[(int)h] = -1;
    h=h+1;
    goto L5;

    L5:
    heap[(int)h]=-1;
    h=h+1;
    return;

}

`

    return TempTxt

}
