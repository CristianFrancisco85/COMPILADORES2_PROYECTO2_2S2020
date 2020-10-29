import {Optimizaciones,TraduccionTxt} from '../scripts/mainScript.js'

const _ = require('lodash')
let optimizacionesArr=[]

export function start(){

    let result=optimize(TraduccionTxt)
    Optimizaciones.push(optimizacionesArr)
    return result
}

/**
 * Optimiza el codigo
 * @param {String} codeString Codigo a optimizar
 * @returns {string} Codigo Optimizado
 */
function optimize(code){

    let StringArr=code.split("\n")
    algebraicaReduccion(StringArr)
    codigoMuerto(StringArr)

    return StringArr.join("\n")
}

/**
 * Realiza optimizaciones algebraicas y reducciones por la fuerza
 * @param {*} arr 
 */
function algebraicaReduccion(arr){
    let temp,aux;
    
    for(let i=0;i<arr.length;i++){
        temp=String(arr[i])
        //Se buscan instrucciones de la forma temp=temp operador op;
        aux=/(?<temp1>t[0-9]+)=(?<temp2>t[0-9]+)(?<op>[+*/-])(?<num>[0-9]+);/.exec(temp)
        if(aux){
            //Reglas 6,7,8,9
            if(aux.groups.temp1===aux.groups.temp2){
                //Regla 6
                if(aux.groups.op==="+"&&aux.groups.num==="0"){
                    optimizacionesArr.push({
                        Tipo:"-",
                        Regla:"Regla 6",
                        CodeE:temp,
                        CodeA:"-",
                        Fila: i+1
                    }) 
                    _.remove(arr, function(value,index) {
                        return index === i;
                    });  
                }
                //Regla 7
                if(aux.groups.op==="-"&&aux.groups.num==="0"){
                    optimizacionesArr.push({
                        Tipo:"-",
                        Regla:"Regla 7",
                        CodeE:temp,
                        CodeA:"-",
                        Fila: i+1
                    }) 
                    _.remove(arr, function(value,index) {
                        return index === i;
                    });   
                }
                //Regla 8
                if(aux.groups.op==="*"&&aux.groups.num==="1"){
                    optimizacionesArr.push({
                        Tipo:"-",
                        Regla:"Regla 8",
                        CodeE:temp,
                        CodeA:"-",
                        Fila: i+1
                    }) 
                    _.remove(arr, function(value,index) {
                        return index === i;
                    });   
                }
                //Regla 9
                if(aux.groups.op==="/"&&aux.groups.num==="1"){
                    optimizacionesArr.push({
                        Tipo:"-",
                        Regla:"Regla 9",
                        CodeE:temp,
                        CodeA:"-",
                        Fila: i+1
                    }) 
                    _.remove(arr, function(value,index) {
                        return index === i;
                    });   
                }
            }
           
            //Regla 10
            else if(aux.groups.op==="+"&&aux.groups.num==="0"){
                let auxObj ={
                    Tipo:"-",
                    Regla:"Regla 10",
                    CodeE:temp,
                    CodeA:`${aux.groups.temp1}=${aux.groups.temp2};`,
                    Fila: i+1
                } 
                arr[i]=auxObj.CodeA
                optimizacionesArr.push(auxObj)
            }
            //Regla 11
            else if(aux.groups.op==="-"&&aux.groups.num==="0"){
                let auxObj ={
                    Tipo:"-",
                    Regla:"Regla 11",
                    CodeE:temp,
                    CodeA:`${aux.groups.temp1}=${aux.groups.temp2};`,
                    Fila: i+1
                } 
                arr[i]=auxObj.CodeA
                optimizacionesArr.push(auxObj)
            }
            //Regla 12
            else if(aux.groups.op==="*"&&aux.groups.num==="1"){
                let auxObj ={
                    Tipo:"-",
                    Regla:"Regla 12",
                    CodeE:temp,
                    CodeA:`${aux.groups.temp1}=${aux.groups.temp2};`,
                    Fila: i+1
                } 
                arr[i]=auxObj.CodeA
                optimizacionesArr.push(auxObj)
            }
            //Regla 13
            else if(aux.groups.op==="/"&&aux.groups.num==="1"){
                let auxObj ={
                    Tipo:"-",
                    Regla:"Regla 13",
                    CodeE:temp,
                    CodeA:`${aux.groups.temp1}=${aux.groups.temp2};`,
                    Fila: i+1
                } 
                arr[i]=auxObj.CodeA
                optimizacionesArr.push(auxObj)
            }
            //Regla 14
            else if(aux.groups.op==="*"&&aux.groups.num==="2"){
                let auxObj ={
                    Tipo:"-",
                    Regla:"Regla 14",
                    CodeE:temp,
                    CodeA:`${aux.groups.temp1}=${aux.groups.temp2}+${aux.groups.temp2};`,
                    Fila: i+1
                } 
                arr[i]=auxObj.CodeA
                optimizacionesArr.push(auxObj)
            }
            //Regla 15
            else if(aux.groups.op==="*"&&aux.groups.num==="0"){
                let auxObj ={
                    Tipo:"-",
                    Regla:"Regla 15",
                    CodeE:temp,
                    CodeA:`${aux.groups.temp1}=0;`,
                    Fila: i+1
                } 
                arr[i]=auxObj.CodeA
                optimizacionesArr.push(auxObj)
            }

            
        }

    }

}

/**
 * Realiza optimizaciones de eliminacion de codigo muerto
 * @param {*} arr 
 */
function codigoMuerto(arr){

    let temp,aux
    for(let i=0;i<arr.length;i++){
        temp=String(arr[i])

        //Regla 1
        //Se buscan instrucciones de la forma goto L[0-9]+;
        aux=/^\s*goto (?<etiqueta>L[0-9]+);$/.exec(temp)
        if(aux){
            let temp2,aux2
            for(let j=i+1;j<arr.length;j++){
                temp2=String(arr[j])
                //Se buscan etiquetas L[0-9]+
                aux2=/^\s*(?<etiqueta>L[0-9]+):$/.exec(temp2)
                if(aux2){
                    //Si se encontro la etiqueta del salto
                    if(aux.groups.etiqueta===aux2.groups.etiqueta){
                        //Se elimina desde i+1 a j-1
                        let tempStr
                        tempStr=_.filter(arr,function(value,index) {
                            return (index >= i+1 && index <= j-1);
                        }); 
                        tempStr=tempStr.join("\n")
                        _.remove(arr, function(value,index) {
                            return (index >= i+1 && index <= j-1);
                        }); 
                        let auxObj ={
                            Tipo:"Bloques",
                            Regla:"Regla 1",
                            CodeE:tempStr,
                            CodeA:"-",
                            Fila: i+1
                        } 
                        optimizacionesArr.push(auxObj)

                    }
                    //Si no es igual se aborta optimizacion
                    else{
                        break;
                    }

                }

            }

        }



    }

}