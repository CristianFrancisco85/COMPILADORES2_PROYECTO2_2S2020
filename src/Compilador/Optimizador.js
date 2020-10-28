import {Code,CodeFun} from './Traductor'
import {Optimizaciones} from '../scripts/mainScript.js'

const _ = require('lodash')

export function start(){

    optimize(Code)

}

/**
 * Optimiza el codigo
 * @param {String} codeString Codigo a optimizar
 * @returns {string} Codigo Optimizado
 */
function optimize(code){

    let StringArr=code.split("\n")
    console.log(JSON.parse(JSON.stringify(StringArr)))
    algebraicaReduccion(StringArr)
    
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
            console.log(aux)
            //Reglas 6,7,8,9
            if(aux.groups.temp1===aux.groups.temp2){
                if(
                    (aux.groups.op==="+"&&aux.groups.num==="0")||
                    (aux.groups.op==="-"&&aux.groups.num==="0")||
                    (aux.groups.op==="*"&&aux.groups.num==="1")||
                    (aux.groups.op==="/"&&aux.groups.num==="1")
                )
                {
                    _.remove(arr, function(value,index) {
                        return index === i;
                    });   
                }
            }
           
            //Regla 10
            if(aux.groups.op==="+"&&aux.groups.num==="0"){
                arr[i]=`${aux.groups.temp1}=${aux.groups.temp2};`
            }
            //Regla 11
            if(aux.groups.op==="-"&&aux.groups.num==="0"){
                arr[i]=`${aux.groups.temp1}=${aux.groups.temp2};`
            }
            //Regla 12
            if(aux.groups.op==="*"&&aux.groups.num==="1"){
                arr[i]=`${aux.groups.temp1}=${aux.groups.temp2};`
            }
            //Regla 13
            if(aux.groups.op==="/"&&aux.groups.num==="1"){
                arr[i]=`${aux.groups.temp1}=${aux.groups.temp2};`
            }
            //Regla 14
            if(aux.groups.op==="*"&&aux.groups.num==="2"){
                arr[i]=arr[i].replace("*","+")
                arr[i]=arr[i].replace("2",aux.groups.temp2)
            }
            //Regla 15
            if(aux.groups.op==="*"&&aux.groups.num==="0"){
                arr[i]=`${aux.groups.temp1}=0;`
            }

            
        }

    }
    console.log(arr)

}