//Importaciones Default
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//Importaciones de CodeMirror
import {UnControlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/lucario.css';
import 'codemirror/lib/codemirror.css';

//Importaciones de Estilos en General
import  "./styles/styles.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//Importaciones de funciones de JS
import {setCode, Simbolos} from './scripts/mainScript.js'
import {setLC} from './scripts/mainScript.js'
import {setViewer} from './scripts/mainScript.js'
import {setConsole} from './scripts/mainScript.js'
import {translate} from './scripts/mainScript.js'
import {optimize} from './scripts/mainScript.js'
import TablaSimbolos from './components/TablaSimbolos/TablaSimbolos';
import TreeView from './components/TreeView/TreeView';


//Creacion de areas de codigo

function Editor(){ 

  return (
    <div className="col-md-6 divcontent ">
      <h3>Entrada</h3>
      <CodeMirror 
        autoFocus={true} 
        onChange={(editor, data, value) => {setCode(value)}} 
        onCursorActivity={(editor, data, value) => {setLC(editor,document.getElementById("LCEditor"))}}
        options={{
          theme: 'darcula',
          mode: 'javascript',
          matchBrackets: true,
          lineNumbers: true,}
        }
      />
     <h6 id="LCEditor">L:1 C:0</h6>
   </div>
)}

function Viewer(){
  
 return (
    <div className="col-md-6 divcontent ">
      <h3>Salida</h3>
      <CodeMirror 
        onCursorActivity={(editor, data, value) => {setLC(editor,document.getElementById("LCViewer"))}}
        editorDidMount ={ (editor) => setViewer(editor) }
        options={{
          theme: 'darcula',
          mode: 'javascript',
          matchBrackets: true,
          lineNumbers: true,}
        }
    />
    <h6 id="LCViewer">L:1 C:0</h6>
  </div>
 )} 

 function Console(){ 

  return (
     <div className="col-md-12 divcontent">
      <h3>Consola</h3>
     <CodeMirror
      editorDidMount ={ (editor) => setConsole(editor) }  
       options={{
         theme: 'lucario',
         lineNumbers: true,}
       }
     />
   </div>
)}

//Creacion de Botones
function BtnTranslate(){
  return(
    <button className="btn btn-warning col-md-2 " onClick={translate} >Traducir </button>
  )

}

function BtnOptimize(){

  return(
    <button className="btn btn-success col-md-2 offset-md-1 " onClick={optimize} >Optimizar </button>
  )

}


//Componente Principal

function MainComponent(){

  return (

    <div>
      <div className="jumbotron text-center" style={{backgroundColor:'#2b7cc7'}}>
      <h1>MatrioshTS IDE</h1>
      <h5>Generador de Codigo en C</h5>
      </div>

      <div className="container col-md-12">
      
      <div className=" row justify-content-center col-md-12 divcontent">
        <BtnTranslate ></BtnTranslate>
        <BtnOptimize></BtnOptimize>
      </div>
      
      <div className=" row col-md-12 ">
        <Editor></Editor>
        <Viewer></Viewer>
      </div>

      <div className=" row col-md-12 ">
        <Console></Console>
      </div>

      <div className="row col-md-12">
        <div className="col-md-6 divcontent ">
          <h4>Errores Lexicos</h4>
          <div id="Lexicos" className="divLexicos">             
          </div>
        </div>
        
        <div className="col-md-6 divcontent ">
          <h4>Errores Sintacticos</h4>
          <div id="Sintacticos" className="divSintacticos">
          </div>
        </div>
      </div>

      <TablaSimbolos Arr={Simbolos} Title="Traduccion"></TablaSimbolos>
      <TreeView></TreeView>


      </div>
    
    </div>
    
  );

}


ReactDOM.render(
  <MainComponent/>,document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
