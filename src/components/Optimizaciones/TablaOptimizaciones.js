import React from 'react';

class TablaOptimizaciones extends React.Component {
  
  constructor(props) {
    super(props);
    this.itemsArr = props.Arr;
    this.state = {Items: this.itemsArr}
  }

  updateTable = () => {
    this.setState({Items: this.itemsArr})
  };

  clearTable = () =>{
    this.itemsArr.length = 0
    this.updateTable()
  };

  render() {
    return (
      <div className="row col-md-12">
      <div className="col-md-12 divcontent mt-2">

      <h4 className="col-md-5">Optimizaciones</h4> 
      <button onClick={this.updateTable} className="btn btn-warning">Ver Tabla</button>
      <button onClick={this.clearTable} className="offset-md-1 btn btn-danger"> Limpiar Tabla</button>

      {this.state.Items.map( (items) =>    
        <table className="table table-hover mt-4" key={-1}>
          <thead className="thead-dark">           
            <tr>
              <th scope="col">Tipo</th>
              <th scope="col">Regla</th>
              <th scope="col">Codigo Eliminado</th>
              <th scope="col">Codigo Agregado</th>
              <th scope="col">Fila</th>
            </tr>
          </thead>
          <tbody>
            {this.formatearItem(items)}
          </tbody>
        </table> 

      )}
      </div>
      </div>
    )
  }

  formatearItem(items){

    return ( items.map( (item,index) => 
      <tr key={index}>
        <th>{item.Tipo}</th>
        <th>{item.Regla}</th>
        <th>{item.CodeE}</th>
        <th>{item.CodeA}</th>
        <th>{item.Fila}</th>
      </tr>
    ));

  }

}

export default TablaOptimizaciones;
