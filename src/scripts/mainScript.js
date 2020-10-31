import {Traducir,myfuns} from '../Compilador/Traductor.js';
import {start} from '../Compilador/Optimizador'
const parser = require('../Compilador/Gramatica.js').parser;


let ErroresSintacticos=[];
export let CodeTxt="",TraduccionTxt="";
export let Viewer,Console
export let Simbolos=[]
export let Optimizaciones=[]
export let AST,ASTData

parser.yy.parseError = function(msg, hash) {
    ErroresSintacticos.push(
		{
			Error:hash.text,
			Fila:hash.line,
			Columna:hash.loc.first_column
		}); 
    console.log('No se esperaba "'+hash.token+'" en linea '+hash.line); 
}

export function setCode(text){
    CodeTxt=text
}
//Actualiza el numero de linea y columna de un editor
export function setLC(editor,element){
    element.innerHTML="L: "+Number(editor.getCursor().line+1)+" C: "+editor.getCursor().ch
}
export function setViewer(editor){
    Viewer=editor
}
export function setConsole(editor){
    Console=editor
}
export function translate(){
    try {
        //AST ORIGINAL
        AST = parser.parse(CodeTxt.toString());
        //Salida de Traduccion
        TraduccionTxt=Traducir(JSON.parse(JSON.stringify(AST.AST)));
        Viewer.setValue(TraduccionTxt)
        console.log(JSON.stringify(AST,null,2));
    } 
    catch (e) {
        console.error(e.message);
    }
    finally{
        if(AST!==undefined){
            ASTData=AST.AST
        }
        refreshErrores()
    }
}
export function optimize(){
    TraduccionTxt=Viewer.getValue()
    TraduccionTxt= start() 
    Viewer.setValue(TraduccionTxt+myfuns)
}

function refreshErrores(){
    
    document.getElementById("Lexicos").innerHTML=""
    document.getElementById("Sintacticos").innerHTML=""
    if(AST!==undefined){
        if(AST.ErroresLexicos.length>0){
            setErrorLexico(AST.ErroresLexicos)
        }   
    }
    if(ErroresSintacticos.length>0){
            setErrorSintactico(ErroresSintacticos)
        }
}

function setErrorLexico(Errores){
    for(var i=0;i<Errores.length;i++){
        var texto=document.createElement("p");
        texto.innerHTML="Caracter invalido "+Errores[i].Error+
        " en fila "+Errores[i].Fila+" y columna "+Errores[i].Columna;
        document.getElementById("Lexicos").appendChild(texto);
    }
}
function setErrorSintactico(Errores){
    for(var i=0;i<Errores.length;i++){
        var texto=document.createElement("p");
        texto.innerHTML="No se esperaba "+Errores[i].Error+
        " en fila "+Errores[i].Fila+" y columna "+Errores[i].Columna
        document.getElementById("Sintacticos").appendChild(texto);
    }
    ErroresSintacticos=[]
}


