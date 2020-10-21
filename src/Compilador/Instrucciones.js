

// Tipos de Operaciones
const Tipo_Operacion = {
    //Aritmetica
    NEGACION:       'NEGACION',
    MULTIPLICACION: 'MULTIPLICACION',
	DIVISION:       'DIVISION',
	SUMA:           'SUMA',
    RESTA:          'RESTA',
    MODULO:         'MODULO',
	POTENCIA:       'POTENCIA',
	CONCATENACION:	'CONCATENACION',
	DECREMENTO:		'DECREMENTO',
	INCREMENTO:		'INCREMENTO',
    //Relacional
	MAYOR_QUE:      'MAYOR_QUE',
	MENOR_QUE:      'MENOR_QUE',
	MAYOR_IGUAL: 	'MAYOR_IGUAL',
	MENOR_IGUAL:    'MENOR_IGUAL',
	DOBLE_IGUAL:    'DOBLE_IGUAL',
    NO_IGUAL:    	'IGUAL_QUE',
    //Logica
	AND:  			'AND',
	OR: 			'OR',
    NOT:   			'NOT',  	
    //ATRIBUTOS
    ATRIBUTO:       'ATRIBUTO',
    //ARR
    ACCESO_ARR:     'ACCESO_ARR'
}
// Tipos de Instrucciones
const Tipo_Instruccion = {
    DECLARACION_LET:    'INS_DECLARACION_LET', 
    DECLARACION_TYPE:   'INS_DECLARACION_TYPE', 
    DECLARACION_CONST:  'INS_DECLARACION_CONST', 
	ASIGNACION:			'INS_ASIGANCION', 
	MAS_ASIGNACION:		'INS_MAS_ASIGANCION', 
	ASIGNACION_ARR:	    'INS_ASIGANCION_ARR', 
	MAS_ASIGNACION_ARR:	'INS_MAS_ASIGANCION_ARR', 
    ACCESO_ARR:	        'INS_ACCESO_ARR', 
    GRAFICAR:           'INS_GRAFICAR', 
	DECL_FUNCION:   	'INS_DECLARACION_FUNCION',
    LLAMADA_FUNCION:   	'INS_LLAMADA_FUNCION',
    SALIDA:         	'INS_SALIDA_CONSOLA',
	BLOQUE_IF:      	'INS_BLOQUE_IF',
    BLOQUE_ELSE:      	'INS_BLOQUE_ELSE',
    BLOQUE_TERNARIO:    'INS_BLOQUE_TERNARIO',
	BLOQUE_SWITCH:  	'INS_BLOQUE_SWITCH',
	CASO_SWITCH:  		'INS_CASO_SWITCH',
	CASO_DEFAULT:       'INS_CASO_DEFAULT_SWITCH',	
    BLOQUE_WHILE:   	'INS_BLOQUE_WHILE',
    BLOQUE_DO_WHILE: 	'INS_BLOQUE_DOWHILE',
    BLOQUE_FOR:     	'INS_BLOQUE_FOR',
    BLOQUE_FOR_OF:     	'INS_BLOQUE_FOR_OF',
    BLOQUE_FOR_IN:     	'INS_BLOQUE_FOR_IN',
    CONTINUE:       	'INS_CONTINUE',
    RETURN:         	'INS_RETURN',
    BREAK:          	'INS_BREAK'
}

const _ = require('lodash')

// Tipos de Datos
const Tipo_Valor = {
    NUMBER:         'NUMBER',
    ID:             'ID',
    BOOLEAN:        'BOOLEAN',
    STRING:         'STRING',
    VOID:           'VOID',
    NUMBER_ARR:     'NUMBER_ARR',
    BOOLEAN_ARR:    'BOOLEAN_ARR',
    STRING_ARR:     'STRING_ARR',
    VOID_ARR:       'VOID_ARR',
	NUMBER_ARR_ARR: 'NUMBER_ARR_ARR',
    BOOLEAN_ARR_ARR:'BOOLEAN_ARR_ARR',
    STRING_ARR_ARR: 'STRING_ARR_ARR',
    VOID_ARR_ARR:   'VOID_ARR_ARR',
	NULL:           'NULL',
	NEWARR:			'NEWARR'
}

let ErroresLexicos=[];



const AST_Tools = {

    /**
	* Operaciones Binarias (Arimeticas,Relacional,Logica)
    * @param opIzq Operando Izquierdo 
    * @param operandoDer Operando Derecho
    * @param opTipo  Tipo De Operacion
	 */
	operacionBinaria: function(opIzq, opDer, opTipo,opAux) {
		return {
            OpIzq: opIzq,
            OpDer: opDer,
			OpTipo: opTipo,
			OpAux:opAux
        }
	},

	/**
	 * Crea un nuevo valor
	 * @param valor 
	 * @param valTipo 
	 */
	crearValor: function(valor, valTipo) {
		return {
			Valor: valor,
			Tipo: valTipo
		}
	},

    /**
	 * Crea el bloque global, este contiene todo el codigo fuente
	 * @param sentencias Conjunto de todas las instrucciones 
	 */
	BloquePrincipal: function(sentencias) {
		return {
            AST: sentencias,
			ErroresLexicos:ErroresLexicos,
		}
    },

    /**
	 * Crea Instrucción para una declaracion.
	 * @param id 
	 */
	declaracion_let: function(id) {
		return {
			Tipo: Tipo_Instruccion.DECLARACION_LET,
			ID: id,
		}
    },

    /**
	 * Crea Instrucción para una declaracion.
	 * @param id 
	 */
	declaracion_const: function(id) {
		return {
			Tipo: Tipo_Instruccion.DECLARACION_CONST,
			ID: id,
		}
    },

    /**
	* Crea Instrucción para una declaracion.
	* @param id 
	*/
    declaracion_type: function(id,atrrib) {
		return {
			Tipo: Tipo_Instruccion.DECLARACION_TYPE,
            ID: id,
            Attrib:atrrib
		}
    },

    /**
	* Crea Instrucción para una asignacion.
	* @param id 
	* @param valor 
	*/
	asignacion: function(id, valor) {
		return {
			Tipo: Tipo_Instruccion.ASIGNACION,
			ID: id,
			Valor : valor
		}
	},

	/**
	* Crea Instrucción para una asignacion.
	* @param id 
	* @param valor 
	*/
	masAsignacion: function(id, valor) {
		return {
			Tipo: Tipo_Instruccion.MAS_ASIGNACION,
			ID: id,
			Valor : valor
		}
    },
    
    /**
	* Crea Instrucción para una asignacion.
	* @param id 
	* @param valor 
	*/
	asignacionArr: function(id,pos,pos2,valor) {
		return {
			Tipo: Tipo_Instruccion.ASIGNACION_ARR,
            ID: id,
			Posicion:pos,
			Posicion2:pos2,
			Valor : valor
		}
	},
	
	/**
	* Crea Instrucción para una asignacion.
	* @param id 
	* @param valor 
	*/
	masAsignacionArr: function(id,pos,pos2,valor) {
		return {
			Tipo: Tipo_Instruccion.MAS_ASIGNACION_ARR,
            ID: id,
			Posicion:pos,
			Posicion2:pos2,
			Valor : valor
		}
    },
    
    /**
	 * Crea un id
	 * @param id 
	 */
	newID: function (id,tipo,valor) {
		return{
            ID:id,
            Tipo:tipo,
            Valor:valor
        }
    },
    
    /**
	 * Crea una lista de ids
	 * @param Primer ID
	 */
	newIDList: function (id,tipo,valor) {
        var ids = []; 
		ids.push({
            ID:id,
            Tipo:tipo,
            Valor:valor
        })
        return ids

    },

    /**
	 * Crea un atributo
	 * @param id 
	 */
	newAttrib: function (id,tipo) {
		return{
            ID:id,
            Tipo:tipo,
        }
    },
    
    /**
	 * Crea una lista de atributos
	 * @param Primer ID
	 */
	newAttribList: function (id,tipo) {
        var attribs = []; 
		attribs.push({
            ID:id,
            Tipo:tipo
        })
        return attribs

    },

    /**
	 * Crea un valor de type
	 * @param id 
	 */
	newTypeVal: function (id,valor) {
		return{
            ID:id,
            Valor:valor,
        }
    },
    
    /**
	 * Crea una lista de valores de un type
	 * @param Primer ID
	 */
	newTypeValList: function (id,valor) {
        var vals = []; 
		vals.push({
            ID:id,
            Valor:valor
        })
        return vals

    },

     /**
	 * Crea un valor de array
	 * @param id 
	 */
	newArrVal: function (valor) {
		return{
            Valor:valor,
        }
    },
    
    /**
	 * Crea una lista de valores de un array
	 * @param Primer ID
	 */
	newArrValList: function (valor) {
        var vals = []; 
		vals.push({
            Valor:valor
        })
        return vals

    },

    /**
	 * Crea un parametro
	 * @param id 
	 */
	newParam: function (valor) {
		return{
            Valor:valor,
        }
    },
    
    /**
	* Crea una lista de parametros
	* @param Primer ID
	*/
	newParamList: function (valor) {
        var params = []; 
		params.push({
            Valor:valor,
        })
        return params
    },

    /**
	 * Crea una llamada de una funcion
	 * @param id Identificador de la funcion
	 */
	llamadaFuncion: function (id,parametros){
		return {
			Tipo: Tipo_Instruccion.LLAMADA_FUNCION,
			ID:id,
			Params:parametros
		}
    },

	/**
	 * Crea una instruccion break
	 */
	nuevaSalida: function (valor){
		return {
            Tipo: Tipo_Instruccion.SALIDA,
            Valor:valor
		}
    },
    
    /**
	 * Crea una instruccion graficarts;
	 */
	nuevoGraficar: function (){
		return {
            Tipo: Tipo_Instruccion.GRAFICAR,
		}
    },
    
    /**
	 * Crea una funcion nueva
	 * @param tipo Tipo de retorno de la funcion
	 * @param id Identificador de la funcion
	 * @param parametros Lista de parametros de la funcion
	 * @param instrucciones Lista de instrucciones de la funcion
	 */
	nuevaFuncion: function (tipo,id,parametros,instrucciones){
		return {
			Tipo: Tipo_Instruccion.DECL_FUNCION,
			Parametros: _.reverse(parametros),
			ID: id,
			Instrucciones : instrucciones,
			TipoRetorno : tipo
		}
	},
    
    /*SENTENCIAS DE FLUJO*/

    /**
	* Crea un nuevo bloque IF
	* @param expresionLogica Expresion Logica
	* @param instrucciones Instrucciones del Bloque
	*/
	nuevoIf: function (expresionLogica,instrucciones){
		return {
			Tipo: Tipo_Instruccion.BLOQUE_IF,
			ExpresionLogica: expresionLogica,
			InstruccionesIf: instrucciones,
		}
    },
    
	/**
	* Crea un nuevo bloque IF_ELSE
	* @param expresionLogica Expresion Logica
	* @param instrucciones Instrucciones del Bloque
	*/
	nuevoIfElse: function (expresionLogica,instrucciones,instruccionesELSE){
		return {
			Tipo: Tipo_Instruccion.BLOQUE_IF,
			ExpresionLogica: expresionLogica,
			InstruccionesIf: instrucciones,
			InstruccionesElse: instruccionesELSE
		}
    },

    /**
	* Crea un nuevo bloque Ternario
	* @param expresionLogica Expresion Logica
    * @param instrucciones Instrucciones de If
    * @param instruccionesELSE Intrucciones de Else
	*/
	nuevoTernario: function (expresionLogica,instrucciones,instruccionesELSE){
		return {
			Tipo: Tipo_Instruccion.BLOQUE_TERNARIO,
			ExpresionLogica: expresionLogica,
            InstruccionesIf: instrucciones,
            InstruccionesElse: instruccionesELSE,
		}
	},


    /**
	 * Crea un nuevo bloque Switch
	 * @param expresionnumerica Expresion numerica de Switch
	 * @param casos Lista de casos 
	*/
	nuevoSwitch: function(expresion, casos) {
		return {
			Tipo: Tipo_Instruccion.BLOQUE_SWITCH,
			Expresion: expresion,
			Casos: casos
		}
	},

	/**
	 * Crea una lista de casos un Switch.
	 * @param {*} caso 
	 */
	listaCasos: function (caso) {
		var casos = []; 
		casos.push(caso);
		return casos;
	},

	/**
	 * Crea un caso para un Switch.
	 * @param {*} casoExpresion 
	 * @param {*} instrucciones 
	 */
	nuevoCaso: function(casoExpresion, instrucciones) {
		return {
			Tipo: Tipo_Instruccion.CASO_SWITCH,
			CasoExpresion: casoExpresion,
			Instrucciones: instrucciones
		}
	},

	/**
	 * Crea un caso default un Switch.
	 * @param {*} casoExpresion 
	 * @param {*} instrucciones 
	 */
	nuevoCasoDefault: function(instrucciones) {
		return {
			Tipo: Tipo_Instruccion.CASO_DEFAULT,
			Instrucciones: instrucciones
		}
	},
    
    /*SENTENCIAS DE REPETICION*/

    /**
	* Crea un nuevo bloque While
	* @param expresionLogica Expresion Logica
	* @param instrucciones Instrucciones del Bloque
	*/
	nuevoWhile: function (expresionLogica,instrucciones){
		return {
			Tipo: Tipo_Instruccion.BLOQUE_WHILE,
			ExpresionLogica: expresionLogica,
			Instrucciones: instrucciones,
		}
	},

	/**
	* Crea un nuevo bloque While
	* @param expresionLogica Expresion Logica
	* @param instrucciones Instrucciones del Bloque
	*/
	nuevoDoWhile: function (expresionLogica,instrucciones){
		return {
			Tipo: Tipo_Instruccion.BLOQUE_DO_WHILE,
			ExpresionLogica: expresionLogica,
			Instrucciones: instrucciones,
		}
    },
    
    /**
	 * Crea un nuevo bloque For
	 * @param operacionInicial Asignacion o Declaracion-Asignacion
	 * @param expresionLogica Expresion Logica
	 * @param expresionPaso Expresion que se ejecuta cada ciclo
	 * @param instrucciones Instrucciones del Bloque
	 */
	nuevoFor: function (operacionInicial,expresionLogica,paso,instrucciones){
		return {
			Tipo: Tipo_Instruccion.BLOQUE_FOR,
			OperacionInicial:operacionInicial,
			ExpresionLogica: expresionLogica,
			ExpresionPaso:paso,
			Instrucciones: instrucciones,
		}
    },

    /**
	 * Crea un nuevo bloque For-Of
	 * @param param1 Variable auxiliar para iterar
	 * @param param2 Variable sobre la cual se itera
	 */
	nuevoForOf: function (param1,param2,instrucciones){
		return {
			Tipo: Tipo_Instruccion.BLOQUE_FOR_OF,
			AuxVar:param1,
            Var: param2,
            Instrucciones: instrucciones,
		}
    },

    /**
	 * Crea un nuevo bloque For-In
	 * @param param1 Variable auxiliar para iterar
	 * @param param2 Variable sobre la cual se itera
	 */
	nuevoForIn: function (param1,param2,instrucciones){
		return {
			Tipo: Tipo_Instruccion.BLOQUE_FOR_IN,
			AuxVar:param1,
            Var: param2,
            Instrucciones: instrucciones,
		}
    },
    
    /*SENTENCIAS DE TRANSFERENCIA*/

    /**
	 * Crea una instruccion break
	 */
	nuevoBreak: function (){
		return {
			Tipo: Tipo_Instruccion.BREAK
		}
	},

	/**
	 * Crea una instruccion continue
	 */
	nuevoContinue: function (){
		return {
			Tipo: Tipo_Instruccion.CONTINUE
		}
	},

	/**
	 * Crea una instruccion return
	 * @param valor Puede ser una expresion o void
	 */
	nuevoReturn: function (valor){
		return {
			Tipo: Tipo_Instruccion.RETURN,
			Valor: valor,
		}
	},
    
}


const Manejo_Errores = {

    /**
	 * Añade un nuevo error Lexico
     * @param error Texto que dio error 
     * @param fila Numero de fila del error
	 */
	addErrorLexico:function(error,fila,columna){
		ErroresLexicos.push(
		{
			Error:error,
			Fila:fila,
			Columna:columna
		});
    },

    /**
     * Limpia los arreglos de errores
     */
    resetErrors:function(){
        ErroresLexicos=[];
	}

}

module.exports.Tipo_Operacion = Tipo_Operacion;
module.exports.Tipo_Instruccion = Tipo_Instruccion;
module.exports.Tipo_Valor = Tipo_Valor;
module.exports.AST_Tools = AST_Tools;
module.exports.Manejo_Errores = Manejo_Errores;
module.exports.ErroresLexicos = ErroresLexicos;
