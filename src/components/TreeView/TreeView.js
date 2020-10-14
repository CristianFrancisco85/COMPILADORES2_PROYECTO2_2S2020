import React from 'react';
import Tree from 'react-d3-tree';
import {ASTData} from '../../scripts/mainScript'


class TreeView extends React.Component {

  constructor(props){
    super(props)
    this.state = {Data:{attributes:{},children:[]}}
  }
 

  genTree= ()=>{
    if(ASTData!==undefined){
      this.setState({Data : this.formatTree(ASTData)})
    }
  };

  formatTree=(AST)=>{
    let temp = {attributes:{},children:[]}
    for(let instruccion in AST){
      if(typeof AST[instruccion] ==='object' && AST[instruccion]!==null){
        let temp2 = this.formatTree(AST[instruccion])
        temp.children.push({name:instruccion,attributes:temp2.attributes,children:temp2.children})
      }
      else{
        temp.attributes[instruccion]=AST[instruccion]
      }
    }
    return temp
  }

  render(){
    return (
    <div className="row col-md-12 ">
    <div className="col-md-12 divcontent mt-2" id="treeWrapper" style={{width: '500px', height: '800px'}}>

      <h4 className="col-md-5">Visualizador de AST{this.state.Titulo}</h4> 
      <button onClick={this.genTree} className="btn btn-warning">Ver AST</button>
      <Tree data={this.state.Data} />

    </div>
    </div>
    )
  }
}
export default TreeView;
