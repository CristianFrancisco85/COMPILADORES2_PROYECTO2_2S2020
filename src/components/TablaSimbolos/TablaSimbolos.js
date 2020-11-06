import React from 'react';

class TablaSimbolos extends React.Component {
  
  constructor(props) {
    super(props);
    this.simbolosArr = props.Arr;
    this.state = {Simbolos: this.simbolosArr,Titulo: props.Title}
  }

  updateSimbolos = () => {
    this.setState({Simbolos: this.simbolosArr})
  };

  clearSimbolos = () =>{
    this.simbolosArr.length = 0
    this.updateSimbolos()
  };

  render() {
    return (
      <div className="row col-md-12">
      <div className="col-md-12 divcontent mt-2">

      <h4 className="col-md-5">Tabla de Simbolos</h4> 
      <button onClick={this.updateSimbolos} className="btn btn-warning">Ver Tabla</button>
      <button onClick={this.clearSimbolos} className="offset-md-1 btn btn-danger"> Limpiar Tabla</button>

      {this.state.Simbolos.map( (TablaTS) =>    
        <table className="table table-hover mt-4" key={-1}>
          <thead className="thead-dark">           
            <tr>
              <th scope="col">Identificador</th>
              <th scope="col">Tipo Dato</th>
              <th scope="col">Tipo Variable</th>
              <th scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            {this.formatearSimbolos(TablaTS)}
          </tbody>
        </table> 

      )}
      </div>
      </div>
    )
  }

  formatearSimbolos(Simbolos){

    return ( Simbolos.map( (simbolo,index) => 
      <tr key={index}>
        <th>{simbolo.ID}</th>
        <th>{simbolo.Tipo}</th>
        <th>{simbolo.Rol}</th>
        <th>{JSON.stringify(simbolo.Valor)}</th>
      </tr>
    ));

  }

}

export default TablaSimbolos;
