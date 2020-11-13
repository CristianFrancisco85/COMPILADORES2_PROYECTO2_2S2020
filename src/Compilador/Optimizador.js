import {Optimizaciones,TraduccionTxt} from '../scripts/mainScript.js'
import {myfuns} from './Traductor'

const _ = require('lodash')
let optimizacionesArr

export function start(){
    optimizacionesArr=[]
    let tempText= TraduccionTxt.replace(myfuns,"")
    let result=optimize(tempText)
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
    redundancia(StringArr)

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
                    Tipo:"Mirilla",
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
                    Tipo:"Mirilla",
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
                    Tipo:"Mirilla",
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
                    Tipo:"Mirilla",
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
                    Tipo:"Mirilla",
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
                    Tipo:"Mirilla",
                    Regla:"Regla 15",
                    CodeE:temp,
                    CodeA:`${aux.groups.temp1}=0;`,
                    Fila: i+1
                } 
                arr[i]=auxObj.CodeA
                optimizacionesArr.push(auxObj)
            }            
        }
        else{
            //Se buscan instrucciones de la forma temp=temp operador op;
            aux=/(?<temp1>t[0-9]+)=(?<num>[0-9]+)(?<op>[+*/-])(?<temp2>t[0-9]+);/.exec(temp)
            if(aux){
                console.log(aux);
                //Reglas 6,7,8
                if(aux.groups.temp1===aux.groups.temp2){
                    //Regla 6
                    if(aux.groups.op==="+"&&aux.groups.num==="0"){
                        optimizacionesArr.push({
                            Tipo:"Mirrila",
                            Regla:"Regla 6",
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
                            Tipo:"Mirilla",
                            Regla:"Regla 8",
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
                        Tipo:"Mirilla",
                        Regla:"Regla 10",
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
                        Tipo:"Mirilla",
                        Regla:"Regla 12",
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
                        Tipo:"Mirilla",
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
                        Tipo:"Mirilla",
                        Regla:"Regla 15",
                        CodeE:temp,
                        CodeA:`${aux.groups.temp1}=0;`,
                        Fila: i+1
                    } 
                    arr[i]=auxObj.CodeA
                    optimizacionesArr.push(auxObj)
                }
                //Regla 16
                else if(aux.groups.op==="/"&&aux.groups.num==="0"){
                    let auxObj ={
                        Tipo:"Mirilla",
                        Regla:"Regla 16",
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

}

/**
 * Realiza optimizaciones de eliminacion de codigo muerto
 * @param {*} arr 
 */
function codigoMuerto(arr){

    let temp,aux
    for(let i=0;i<arr.length;i++){
        //Regla 1
        temp=String(arr[i])
        //Se buscan instrucciones de la forma goto L[0-9]+;
        aux=/^\s*goto (?<etiqueta>L[0-9]+);$/.exec(temp)
        if(aux){
            //Si no pertenece a un salto condicional
            if(!(/^\s*if (?<temp>t[0-9]+) goto (?<etiqueta>L[0-9]+);$/.exec(String(arr[i-1])))){
                let temp2,aux2
                for(let j=i+1;j<arr.length;j++){
                    temp2=String(arr[j])
                    //Se buscan etiquetas L[0-9]+
                    aux2=/^\s*(?<etiqueta>L[0-9]+):$/.exec(temp2)
                    if(aux2){
                        //Si se encontro la etiqueta del salto
                        if(aux.groups.etiqueta===aux2.groups.etiqueta&&j!==i+1){
                            //Codigo eliminado
                            let tempStr
                            tempStr=_.filter(arr,function(value,index) {
                                return (index >= i+1 && index <= j-1);
                            }); 
                            tempStr=tempStr.join("\n")
                            //Se elimina desde i+1 a j-1
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

        //Regla 3 y 4 
        temp=String(arr[i])
        //Se buscan instrucciones de la forma if (t[0-9]+) goto L[0-9];
        aux=/^\s*if \((?<temp>t[0-9]+)\) goto (?<etiqueta>L[0-9]+);$/.exec(temp)
        if(aux){
            let temp2,aux2
            temp2=String(arr[i-1])
            //Se busca instruccion de la forma t[0-9]+=[0-9]+ op [0-9]+;
            aux2=/(?<temp1>t[0-9]+)=(?<num1>[0-9]+)(?<op><|>|<=|>=|==|!=)(?<num2>[0-9]+);/.exec(temp2)
            if(aux2){
                //Regla 3
                if(getBoolean(aux2.groups.num1,aux2.groups.num2,aux2.groups.op)){
                    //Codigo eliminado
                    let tempStr
                    tempStr=_.filter(arr,function(value,index) {
                        return (index >= i-1 && index <= i+1);
                    }); 
                    tempStr=tempStr.join("\n")
                    arr[i]=`goto ${aux.groups.etiqueta};`
                    //Se elimina i-1 y i+1
                    _.remove(arr, function(value,index) {
                        return (index === i-1 || index === i+1);
                    });
                    let auxObj ={
                        Tipo:"Bloques",
                        Regla:"Regla 3",
                        CodeE:tempStr,
                        CodeA:`goto ${aux.groups.etiqueta};`,
                        Fila: i+1
                    } 
                    optimizacionesArr.push(auxObj)
                }
                //Regla 4
                else{
                    //Codigo eliminado
                    let tempStr
                    tempStr=_.filter(arr,function(value,index) {
                        return (index >= i-1 && index <= i);
                    }); 
                    tempStr=tempStr.join("\n")
                    //Se elimina i-1 y i
                    _.remove(arr, function(value,index) {
                        return (index === i-1 || index === i);
                    });
                    let auxObj ={
                        Tipo:"Bloques",
                        Regla:"Regla 4",
                        CodeE:tempStr,
                        CodeA:'-',
                        Fila: i+1
                    } 
                    optimizacionesArr.push(auxObj)
                }
            }
        }
        //Regla 3 y 4 con condicional 0 o 1
        temp=String(arr[i])
        //Se buscan instrucciones de la forma if (t[0-9]+) goto L[0-9];
        aux=/^\s*if \((?<temp>0|1+)\) goto (?<etiqueta>L[0-9]+);$/.exec(temp)
        if(aux){
            //Regla 3
            if(Number(aux.groups.temp)===1){
                //Codigo eliminado
                let tempStr
                tempStr=_.filter(arr,function(value,index) {
                    return (index >= i && index <= i+1);
                }); 
                tempStr=tempStr.join("\n")
                arr[i]=`goto ${aux.groups.etiqueta};`
                //Se elimina i y i+1
                _.remove(arr, function(value,index) {
                    return (index === i || index === i+1);
                });
                let auxObj ={
                    Tipo:"Bloques",
                    Regla:"Regla 3",
                    CodeE:tempStr,
                    CodeA:`goto ${aux.groups.etiqueta};`,
                    Fila: i+1
                } 
                optimizacionesArr.push(auxObj)
            }
            //Regla 4
            else{
                //Codigo eliminado
                let tempStr
                tempStr=_.filter(arr,function(value,index) {
                    return (index >= i && index <= i);
                }); 
                tempStr=tempStr.join("\n")
                //Se elimina i y i
                _.remove(arr, function(value,index) {
                    return (index === i|| index === i);
                });
                let auxObj ={
                    Tipo:"Bloques",
                    Regla:"Regla 4",
                    CodeE:tempStr,
                    CodeA:'-',
                    Fila: i+1
                } 
                optimizacionesArr.push(auxObj)
            }
            
        }


        //Regla 2
        temp=String(arr[i])
        //Se buscan instrucciones de la forma if (t[0-9]+) goto L[0-9];
        aux=/^\s*if \((?<temp>t[0-9]+)\) goto (?<etiqueta>L[0-9]+);$/.exec(temp)
        if(aux){
            let temp2,aux2
            temp2=String(arr[i+1])
            //Se busca etiqueta goto L[0-9]+
            aux2=/^\s*goto (?<etiqueta>L[0-9]+);$/.exec(temp2)
            if(aux2){
                let temp3,aux3
                temp3=String(arr[i+2])
                //Se busca etiqueta L[0-9]+
                aux3=/^\s*(?<etiqueta>L[0-9]+):$/.exec(temp3)
                if(aux3){
                    if(aux3.groups.etiqueta===aux.groups.etiqueta){
                        let temp4,aux4,auxBool=false
                        for(let j=0;j<i;j++){
                            temp4=String(arr[j])
                            //Se buscan instrucciones de la forma if (t[0-9]+) goto L[0-9];
                            aux4=/^\s*if \((?<temp>t[0-9]+)\) goto (?<etiqueta>L[0-9]+);$/.exec(temp4)
                            if(aux4){
                                if(aux4.groups.etiqueta===aux.groups.etiqueta){
                                    auxBool=true;
                                    break
                                }
                            }
                        }

                        if(auxBool){
                            //Codigo Eliminado
                            let tempStr
                            tempStr=_.filter(arr,function(value,index) {
                                return (index >= i && index <= i+1);
                            }); 
                            tempStr=tempStr.join("\n")

                            //Se cambia salto condicional
                            arr[i]=arr[i].replace(aux.groups.etiqueta,aux2.groups.etiqueta)
                            arr[i]=arr[i].replace(aux.groups.temp,aux.groups.temp+'==0')
                            //Se remueve desde i+1 a i+1
                            _.remove(arr, function(value,index) {
                                return (index >= i+1 && index <= i+1);
                            }); 
                            temp=String(arr[i])
                            let auxObj ={
                                Tipo:"Bloques",
                                Regla:"Regla 2",
                                CodeE:tempStr,
                                CodeA:temp,
                                Fila: i+1
                            } 
                            optimizacionesArr.push(auxObj)

                        }
                        else{
                            //Codigo Eliminado
                            let tempStr
                            tempStr=_.filter(arr,function(value,index) {
                                return (index >= i && index <= i+2);
                            }); 
                            tempStr=tempStr.join("\n")

                            //Se cambia salto condicional
                            arr[i]=arr[i].replace(aux.groups.etiqueta,aux2.groups.etiqueta)
                            arr[i]=arr[i].replace(aux.groups.temp,aux.groups.temp+'==0')
                            //Se remueve desde i+1 a i+2
                            _.remove(arr, function(value,index) {
                                return (index >= i+1 && index <= i+2);
                            }); 
                            temp=String(arr[i])
                            let auxObj ={
                                Tipo:"Bloques",
                                Regla:"Regla 2",
                                CodeE:tempStr,
                                CodeA:temp,
                                Fila: i+1
                            } 
                            optimizacionesArr.push(auxObj)
                        }
                    }
                }
            }
        }


    }

}

/**
 * Realiza optimizaciones de eliminacion de redundacias
 * @param {*} arr 
 */
function redundancia(arr){
    let temp,aux
    for(let i=0;i<arr.length;i++){
        //Regla 5
        temp=String(arr[i])
        //Se busca instruccion de la forma t[0-9]+=t[0-9];
        aux=/(?<temp1>t[0-9]+)=(?<temp2>t[0-9]+);/.exec(temp)
        if(aux){
            let temp2,aux2
            temp2=String(arr[i+1])
            //Se busca instruccion de la forma t[0-9]+=t[0-9];
            aux2=/(?<temp1>t[0-9]+)=(?<temp2>t[0-9]+);/.exec(temp2)
            if(aux2){
                if((aux.groups.temp1===aux2.groups.temp2)&&(aux.groups.temp2===aux2.groups.temp1)){
                    //Se remueve desde i+1 
                    _.remove(arr, function(value,index) {
                        return index >= i+1;
                    }); 
                    temp=String(arr[i])
                    let auxObj ={
                        Tipo:"Bloques",
                        Regla:"Regla 2",
                        CodeE:temp2,
                        CodeA:"-",
                        Fila: i+1
                    } 
                    optimizacionesArr.push(auxObj)
                }

            }
        }
    }

}


function getBoolean(num1,num2,operador){

    switch(operador){
        case ">":{
            return Number(num1)>Number(num2)
        }
        case "<":{
            return Number(num1)<Number(num2)
        }
        case ">=":{
            return Number(num1)>=Number(num2)
        }
        case "<=":{
            return Number(num1)<=Number(num2)
        }
        case "!=":{
            return Number(num1)!==Number(num2)
        }
        case "==":{
            return Number(num1)===Number(num2)
        }
        default:
    }

}