/* Cristian Meoño - 201801397 */

%lex

%options lex case-insensitive yylineno


%% 

\s+							        /* Ignorar Espacios */
"//".*	                            /* Comentario Simple */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] /* Comentario Multiple */

"string"                    return 'STRING';
"number"	                return 'NUMBER';
"boolean"                   return 'BOOLEAN';
"void"                      return 'VOID';
"type"                      return 'TYPE';
"true"                      return 'TRUE'
"false"                     return 'FALSE'
"null"                      return 'NULL'

"let"                       return 'LET';
"const"                     return 'CONST';

"++"                        return 'INCREMENTO';
"--"                        return 'DECREMENTO';
"+="                        return 'MAS_ASIG';
"/"                         return 'OPDIV';
"**"                        return 'OPCIRCU';
"*"                         return 'OPMULTI';
"%"                         return 'OPMOD';
"-"                         return 'OPMENOS';
"+"                         return 'OPMAS';

"["                         return 'CORIZQ';
"]"                         return 'CORDER';
"("                         return 'PARIZQ';
")"                         return 'PARDER';
"{"                         return 'LLAVIZQ';
"}"                         return 'LLAVDER';


">="                        return 'MAYORIG';
"<="                        return 'MENORIG';
"<"                         return 'MENOR';
">"                         return 'MAYOR';
"=="                        return 'DIGUAL';
"="                         return 'IGUAL';
"!="                        return 'NIGUAL';

"."                         return 'PUNTO';
";"                         return 'PUNTOYCOMA';
","                         return 'COMA';
":"                         return 'DOSPUNTOS';
"?"                         return 'TERNARIO';

"&&"                        return 'AND';
"||"                        return 'OR';
"!"                         return 'NOT';

"if"                        return 'IF';
"else"                      return 'ELSE';
"switch"                    return 'SWITCH';
"case"                      return 'CASE';
"default"                   return 'DEFAULT';
"while"                     return 'WHILE';
"do"                        return 'DO';
"for"                       return 'FOR';
"of"                        return 'OF';
"in"                        return 'IN';
"break"                     return 'BREAK';
"continue"                  return 'CONTINUE';
"return"                    return 'RETURN';
"function"                  return 'FUNCTION';
"console"                   return 'CONSOLE';
"log"                       return 'LOG';
"graficar_ts"               return 'GRAFICAR';
"Array"                     return 'ARRAY'
"new"                       return 'NEW'


\"(\\\"|[^\"])*\"			{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
\'(\\\"|[^\'])*\'			{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
[0-9]+("."[0-9]+)?\b        return 'NUMERO'
([a-zA-Z])[a-zA-Z0-9_]*	    return 'ID';
<<EOF>>                     return 'EOF';
.                           {Manejo_Errores.addErrorLexico(yytext,yylineno+1,yylloc.first_column);return''}

/lex

%{
    let defaultVal;
	const Tipo_Operacion	= require('./Instrucciones.js').Tipo_Operacion;
	const Tipo_Valor 	    = require('./Instrucciones.js').Tipo_Valor;
    const AST_Tools     	= require('./Instrucciones.js').AST_Tools;
    const Manejo_Errores    = require('./Instrucciones.js').Manejo_Errores;
%}

%right 'TERNARIO' 'DOSPUNTOS'
%left 'OR'
%left 'AND'
%left 'DIGUAL' 'NIGUAL'
%left 'MAYOR' 'MENOR' 'MENORIG' 'MAYORIG'
%left 'OPMAS' 'OPMENOS'
%left 'OPMOD' 'OPDIV' 'OPMULTI'
%left 'OPCIRCU'
%right  'UMENOS' 'NOT'
%nonassoc 'DECREMENTO' 'INCREMENTO'
%left 'PUNTO'
%nonassoc 'PARDER' 'PARIZQ'

%start init

%% 

init
    : inicio EOF {Manejo_Errores.resetErrors();return $1;}
;

inicio
    : instrucciones   {$$=AST_Tools.BloquePrincipal($1);}       
;

instrucciones
	: instrucciones instruccion { $1.push($2);$$ = $1; }	
	| instruccion				{ $$ = [$1];}	
;

instruccion
    : asignacion                                            {$$=$1}
    | masAsig                                               {$$=$1}
    | declaracionAsignacion                                 {$$=$1}
    | bloqueIf                                              {$$=$1}
    | bloqueWhile                                           {$$=$1}
    | bloqueDoWhile                                         {$$=$1}
    | bloqueFor                                             {$$=$1}
    | bloqueForOf                                           {$$=$1}
    | bloqueForIn                                           {$$=$1}
    | bloqueSwitch                                          {$$=$1}
    | atributos PUNTOYCOMA                                  {$$=$1}
    | llamadaFuncion PUNTOYCOMA                             {$$=$1}
    | incremento_decremento PUNTOYCOMA                      {$$=$1}
    | sentenciasTransferencia                               {$$=$1}
    | declaracionFuncion                                    {$$=$1}
    | GRAFICAR PARIZQ PARDER PUNTOYCOMA                     {$$=AST_Tools.nuevoGraficar();}
    | CONSOLE PUNTO LOG PARIZQ expresion PARDER PUNTOYCOMA  {$$=AST_Tools.nuevaSalida($5)}
    | error PUNTOYCOMA                                      {$$=undefined; }           
;

/*DECLARACIONES, ASIGNACIONES Y EXPRESIONES*/

declaracionAsignacion
    : LET listaID PUNTOYCOMA                                            {$$=AST_Tools.declaracion_let($2)}
    | CONST listaID PUNTOYCOMA                                          {$$=AST_Tools.declaracion_const($2)}
    | TYPE ID IGUAL LLAVIZQ listaAttrib LLAVDER PUNTOYCOMA              {$$=AST_Tools.declaracion_type($2,$5)}
    | TYPE ID IGUAL LLAVIZQ listaAttrib COMA LLAVDER PUNTOYCOMA         {$$=AST_Tools.declaracion_type($2,$5)}
    | TYPE ID IGUAL LLAVIZQ listaAttrib PUNTOYCOMA LLAVDER PUNTOYCOMA   {$$=AST_Tools.declaracion_type($2,$5)}
;

asignacion
    : ID IGUAL expresion PUNTOYCOMA                                                         {$$=AST_Tools.asignacion($1,$3)}
    | ID CORIZQ expresion CORDER IGUAL expresion PUNTOYCOMA                                 {$$=AST_Tools.asignacionArr($1,$3,undefined,$6)}
    | ID CORIZQ expresion CORDER CORIZQ expresion CORDER IGUAL expresion PUNTOYCOMA         {$$=AST_Tools.asignacionArr($1,$3,$6,$9)}
    | atributos IGUAL expresion PUNTOYCOMA                                                  {$$=AST_Tools.asignacion($1,$3)}
;

masAsig
    : ID MAS_ASIG expresion PUNTOYCOMA                                                         {$$=AST_Tools.masAsignacion($1,$3)}
    | ID CORIZQ expresion CORDER MAS_ASIG expresion PUNTOYCOMA                                 {$$=AST_Tools.masAsignacionArr($1,$3,undefined,$6)}
    | ID CORIZQ expresion CORDER CORIZQ expresion CORDER MAS_ASIG expresion PUNTOYCOMA         {$$=AST_Tools.masAsignacionArr($1,$3,$6,$9)}
    | atributos MAS_ASIG expresion PUNTOYCOMA                                                  {$$=AST_Tools.masAsignacion($1,$3)}
;

tipo
    :STRING                         {$$=Tipo_Valor.STRING}
    |NUMBER                         {$$=Tipo_Valor.NUMBER}
    |BOOLEAN                        {$$=Tipo_Valor.BOOLEAN}
    |VOID                           {$$=Tipo_Valor.VOID}
    |ID                             {$$=$1}
    |STRING CORIZQ CORDER           {$$=Tipo_Valor.STRING_ARR}
    |NUMBER CORIZQ CORDER           {$$=Tipo_Valor.NUMBER_ARR}
    |BOOLEAN CORIZQ CORDER          {$$=Tipo_Valor.BOOLEAN_ARR}
    |VOID CORIZQ CORDER             {$$=Tipo_Valor.VOID_ARR}
    |ID CORIZQ CORDER               {$$=($1+"_ARR")}
    |STRING CORIZQ CORDER CORIZQ CORDER          {$$=Tipo_Valor.STRING_ARR_ARR}
    |NUMBER CORIZQ CORDER CORIZQ CORDER          {$$=Tipo_Valor.NUMBER_ARR_ARR}
    |BOOLEAN CORIZQ CORDER CORIZQ CORDER         {$$=Tipo_Valor.BOOLEAN_ARR_ARR}
    |VOID CORIZQ CORDER CORIZQ CORDER            {$$=Tipo_Valor.VOID_ARR_ARR}
    |ID CORIZQ CORDER CORIZQ CORDER              {$$=($1+"_ARR_ARR")}
;

listaID
    //SIN VALOR
    :listaID COMA ID DOSPUNTOS tipo     
    {
        if($5===Tipo_Valor.NUMBER){defaultVal={
            Valor: 0,
            Tipo:Tipo_Valor.NUMBER
          }}
        else if($5===Tipo_Valor.BOOLEAN){defaultVal={
            Valor: false,
            Tipo:Tipo_Valor.BOOLEAN
          }}
        else{defaultVal=defaultVal={
            Valor: null,
            Tipo:Tipo_Valor.NULL
          }}
        $1.push(AST_Tools.newID($3,$5,defaultVal));
    }                                              
    |ID DOSPUNTOS tipo                 
    {
        if($3===Tipo_Valor.NUMBER){defaultVal={
            Valor: 0,
            Tipo:Tipo_Valor.NUMBER
          }}
        else if($3===Tipo_Valor.BOOLEAN){defaultVal={
            Valor: false,
            Tipo:Tipo_Valor.BOOLEAN
          }}
        else{defaultVal=defaultVal=defaultVal={
            Valor: null,
            Tipo:Tipo_Valor.NULL
          }}
        $$=AST_Tools.newIDList($1,$3,defaultVal);
    }      
    //CON VALOR
    |listaID COMA ID DOSPUNTOS tipo IGUAL expresion                             {$1.push(AST_Tools.newID($3,$5,$7));}                                              
    |listaID COMA ID DOSPUNTOS tipo IGUAL NEW ARRAY PARIZQ expresion PARDER     {$1.push(AST_Tools.newID($3,$5,$7));} 
    |ID DOSPUNTOS tipo IGUAL expresion                                          {$$=AST_Tools.newIDList($1,$3,$5)}                                             
    |ID DOSPUNTOS tipo IGUAL NEW ARRAY PARIZQ expresion PARDER                  {$$=AST_Tools.newIDList($1,$3,AST_Tools.crearValor($8,Tipo_Valor.NEWARR))}
       
;

listaArr
    : listaArr COMA expresion       {$1.push(AST_Tools.newArrVal($3))}
    | expresion                     {$$=AST_Tools.newArrValList($1)}
;

listaAttrib
    : listaAttrib COMA ID DOSPUNTOS tipo            {$1.push(AST_Tools.newAttrib($3,$5))}
    | listaAttrib PUNTOYCOMA ID DOSPUNTOS tipo      {$1.push(AST_Tools.newAttrib($3,$5))}
    | ID DOSPUNTOS tipo                             {$$=AST_Tools.newAttribList($1,$3)}
;

listaVal
    : listaVal COMA ID DOSPUNTOS expresion       {$1.push(AST_Tools.newTypeVal($3,$5))}
    | ID DOSPUNTOS expresion                     {$$=AST_Tools.newTypeValList($1,$3)}
;

listaParam
    : listaParam COMA expresion     {$1.push(AST_Tools.newParam($3))}
    | expresion                     {$$=AST_Tools.newParamList($1)}
;

expresion
    : PARIZQ expresion PARDER			    { $$ = $2; }
    //ARITMETICAS
    | OPMENOS expresion %prec UMENOS	    { $$ = AST_Tools.operacionBinaria ($2,undefined,Tipo_Operacion.NEGACION); }
    | expresion OPMENOS expresion		    { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.RESTA);}
	| expresion OPMAS expresion	            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.SUMA);}	
	| expresion OPDIV expresion		        { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.DIVISION);}				
    | expresion OPMOD expresion	            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MODULO);}
    | expresion OPCIRCU expresion           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.POTENCIA);}
    | expresion OPMULTI expresion           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MULTIPLICACION);}
	| NUMERO							    { $$ = AST_Tools.crearValor(Number($1),Tipo_Valor.NUMBER); }
	| ID                                    { $$ = AST_Tools.crearValor($1,Tipo_Valor.ID); }
    | CADENA                                { $$ = AST_Tools.crearValor($1,Tipo_Valor.STRING); }
    | incremento_decremento                 { $$ = $1}
    //LOGICAS
    | expresion AND expresion               { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.AND);}
    | expresion OR expresion                { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.OR);}
    | NOT expresion                         { $$ = AST_Tools.operacionBinaria ($2,undefined,Tipo_Operacion.NOT);}
    | TRUE                                  { $$ = AST_Tools.crearValor(true,Tipo_Valor.BOOLEAN);}
    | FALSE                                 { $$ = AST_Tools.crearValor(false,Tipo_Valor.BOOLEAN);}
    | NULL                                  { $$ = AST_Tools.crearValor(null,Tipo_Valor.NULL);}
    //RELACIONALES
    | expresion MAYOR expresion             { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MAYOR_QUE);}
    | expresion MENOR expresion             { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MENOR_QUE);}
    | expresion MAYORIG expresion           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MAYOR_IGUAL);}
    | expresion MENORIG expresion           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MENOR_IGUAL);}
    | expresion DIGUAL expresion            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.DOBLE_IGUAL);}
    | expresion NIGUAL expresion            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.NO_IGUAL);}
    //FUNCIONES, ATRIBUTOS, ARRAYS Y TYPES
    | llamadaFuncion                        { $$ = $1}
    | bloqueTernario                        { $$ = $1}
    | atributos                             { $$ = $1}
    | CORIZQ listaArr CORDER                { $$ = $2}
    | CORIZQ  CORDER                        { $$ = []}
    | LLAVIZQ listaVal LLAVDER              { $$ = $2}
    | LLAVIZQ listaVal COMA LLAVDER         { $$ = $2}
    | LLAVIZQ listaVal PUNTOYCOMA LLAVDER   { $$ = $2}
    | ID CORIZQ expresion CORDER            { $$ = AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ACCESO_ARR)} 
    | ID CORIZQ expresion CORDER CORIZQ expresion CORDER { $$ = AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ACCESO_ARR),$6,Tipo_Operacion.ACCESO_ARR)} 
;

incremento_decremento 
    : expresion DECREMENTO     { $$ = AST_Tools.operacionBinaria ($1,undefined,Tipo_Operacion.DECREMENTO); }
    | expresion INCREMENTO     { $$ = AST_Tools.operacionBinaria ($1,undefined,Tipo_Operacion.INCREMENTO); }
;

atributos
    : atributos PUNTO ID                                                    { $$ = AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ATRIBUTO)}
    | atributos PUNTO ID CORIZQ expresion CORDER                            { $$ = AST_Tools.operacionBinaria($1,AST_Tools.operacionBinaria($3,$5,Tipo_Operacion.ACCESO_ARR),Tipo_Operacion.ATRIBUTO)}
    | atributos PUNTO ID CORIZQ expresion CORDER CORIZQ expresion CORDER    { $$ = AST_Tools.operacionBinaria($1,AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($3,$5,Tipo_Operacion.ACCESO_ARR),$8,Tipo_Operacion.ACCESO_ARR),Tipo_Operacion.ATRIBUTO)}
    | atributos PUNTO llamadaFuncion                                        { $$ = AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ATRIBUTO)}

    | ID PUNTO ID                                                           { $$ = AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ATRIBUTO)}
    | ID PUNTO ID CORIZQ expresion CORDER                                   { $$ = AST_Tools.operacionBinaria($1,AST_Tools.operacionBinaria($3,$5,Tipo_Operacion.ACCESO_ARR),Tipo_Operacion.ATRIBUTO)}
    | ID PUNTO ID CORIZQ expresion CORDER CORIZQ expresion CORDER           { $$ = AST_Tools.operacionBinaria($1,AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($3,$5,Tipo_Operacion.ACCESO_ARR),$8,Tipo_Operacion.ACCESO_ARR),Tipo_Operacion.ATRIBUTO)}
    | ID PUNTO llamadaFuncion                                               { $$ = AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ATRIBUTO)}

    | ID CORIZQ expresion CORDER PUNTO ID                                   { $$ = AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ACCESO_ARR),$6,Tipo_Operacion.ATRIBUTO)}
    | ID CORIZQ expresion CORDER PUNTO ID CORIZQ expresion CORDER           { $$ = AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ACCESO_ARR),AST_Tools.operacionBinaria($6,$8,Tipo_Operacion.ACCESO_ARR),Tipo_Operacion.ATRIBUTO)}
    | ID CORIZQ expresion CORDER PUNTO ID CORIZQ expresion CORDER CORIZQ expresion CORDER    { $$ = AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ACCESO_ARR),AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($6,$8,Tipo_Operacion.ACCESO_ARR),$11,Tipo_Operacion.ACCESO_ARR),Tipo_Operacion.ATRIBUTO)}
    | ID CORIZQ expresion CORDER PUNTO llamadaFuncion                       { $$ = AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ACCESO_ARR),$6,Tipo_Operacion.ATRIBUTO)}     

    | llamadaFuncion PUNTO ID                                               { $$ = AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ATRIBUTO)}
    | llamadaFuncion PUNTO ID CORIZQ expresion CORDER                       { $$ = AST_Tools.operacionBinaria($1,AST_Tools.operacionBinaria($3,$5,Tipo_Operacion.ACCESO_ARR),Tipo_Operacion.ATRIBUTO)}
    | llamadaFuncion PUNTO ID CORIZQ expresion CORDER CORIZQ expresion CORDER{ $$ = AST_Tools.operacionBinaria($1,AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($3,$5,Tipo_Operacion.ACCESO_ARR),$8,Tipo_Operacion.ACCESO_ARR),Tipo_Operacion.ATRIBUTO)}
    | llamadaFuncion PUNTO llamadaFuncion                                   { $$ = AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ATRIBUTO)}

    | ID CORIZQ expresion CORDER CORIZQ expresion CORDER PUNTO ID                                                           {$$ = AST_Tools.operacionBinaria(AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ACCESO_ARR),$6,Tipo_Operacion.ACCESO_ARR),$9,Tipo_Operacion.ATRIBUTO)}
    | ID CORIZQ expresion CORDER CORIZQ expresion CORDER PUNTO ID CORIZQ expresion CORDER                                   {$$ = AST_Tools.operacionBinaria(AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ACCESO_ARR),$6,Tipo_Operacion.ACCESO_ARR),AST_Tools.operacionBinaria($9,$11,Tipo_Operacion.ACCESO_ARR),Tipo_Operacion.ATRIBUTO)}
    | ID CORIZQ expresion CORDER CORIZQ expresion CORDER PUNTO ID CORIZQ expresion CORDER CORIZQ expresion CORDER           {$$ = AST_Tools.operacionBinaria(AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ACCESO_ARR),$6,Tipo_Operacion.ACCESO_ARR),AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($9,$11,Tipo_Operacion.ACCESO_ARR),$14,Tipo_Operacion.ACCESO_ARR),Tipo_Operacion.ATRIBUTO)}
    | ID CORIZQ expresion CORDER CORIZQ expresion CORDER PUNTO llamadaFuncion                                               {$$ = AST_Tools.operacionBinaria(AST_Tools.operacionBinaria(AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ACCESO_ARR),$6,Tipo_Operacion.ACCESO_ARR),$9,Tipo_Operacion.ATRIBUTO)}
;

llamadaFuncion
    : ID PARIZQ listaParam PARDER           { $$ = AST_Tools.llamadaFuncion($1,$3);}
    | ID PARIZQ PARDER                      { $$ = AST_Tools.llamadaFuncion($1,undefined);}
;

sentenciasTransferencia
    : BREAK PUNTOYCOMA                  {$$=AST_Tools.nuevoBreak();}          
    | CONTINUE PUNTOYCOMA               {$$=AST_Tools.nuevoContinue();}  
    | RETURN PUNTOYCOMA                 {$$=AST_Tools.nuevoReturn(undefined);} 
    | RETURN expresion PUNTOYCOMA       {$$=AST_Tools.nuevoReturn($2);} 
;

/* GRAMATICAS DESCENDENTES :O */

declaracionFuncion
    : FUNCTION ID PARIZQ listaIDFun PARDER DOSPUNTOS tipo LLAVIZQ instrucciones LLAVDER  {$$=AST_Tools.nuevaFuncion($7,$2,$4,$9)} 
    | FUNCTION ID PARIZQ  PARDER DOSPUNTOS tipo LLAVIZQ instrucciones LLAVDER         {$$=AST_Tools.nuevaFuncion($6,$2,undefined,$8)} 
    | FUNCTION ID PARIZQ listaIDFun PARDER DOSPUNTOS tipo LLAVIZQ  LLAVDER               {$$=AST_Tools.nuevaFuncion($7,$2,$4,undefined)}
    | FUNCTION ID PARIZQ  PARDER DOSPUNTOS tipo LLAVIZQ  LLAVDER                      {$$=AST_Tools.nuevaFuncion($6,$2,undefined,undefined)}  
;

listaIDFun
    : ID DOSPUNTOS tipo listaIDFunPrima    {$$=$4;}
;

listaIDFunPrima
    : COMA ID DOSPUNTOS tipo listaIDFunPrima {$5.push(AST_Tools.newID($-2,$-0));$$=$5}
    | {$$=AST_Tools.newIDList($-1,$1);}
;


/* SENTENCIAS DE CONTROL DE FLUJO */

bloqueIf
    : IF PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER              {$$= AST_Tools.nuevoIf($3,$6);}
    | IF PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER bloqueElse   {$$= AST_Tools.nuevoIfElse($3,$6,$8)}
    | IF PARIZQ expresion PARDER LLAVIZQ LLAVDER                            {$$= AST_Tools.nuevoIf($3,undefined);}
    | IF PARIZQ expresion PARDER LLAVIZQ LLAVDER bloqueElse                 {$$= AST_Tools.nuevoIfElse($3,undefined,$7)}
;

bloqueElse
    : ELSE LLAVIZQ instrucciones LLAVDER                                           {$$= $3}
    | ELSE IF PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER                {$$= [AST_Tools.nuevoIf($4,$7)]}
    | ELSE IF PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER bloqueElse     {$$= [AST_Tools.nuevoIfElse($4,$7,$9)]}
    | ELSE LLAVIZQ  LLAVDER                                                        {$$= undefined}
    | ELSE IF PARIZQ expresion PARDER LLAVIZQ LLAVDER                              {$$= [AST_Tools.nuevoIf($4,undefined)]}
    | ELSE IF PARIZQ expresion PARDER LLAVIZQ LLAVDER bloqueElse                   {$$= [AST_Tools.nuevoIfElse($4,undefined,$8)]}
;

bloqueTernario
    : expresion TERNARIO expresion DOSPUNTOS expresion      {$$=AST_Tools.nuevoTernario($1,$3,$5)}
    | expresion TERNARIO expresion                          {$$=AST_Tools.nuevoTernario($1,$3,undefined)}
;

bloqueSwitch
    : SWITCH PARIZQ expresion PARDER LLAVIZQ casos LLAVDER     {$$=AST_Tools.nuevoSwitch($3,$6);}
;

casos 
    : casos caso    {$1.push($2);}
    | caso          {$$=AST_Tools.listaCasos($1);}
;

caso 
    : CASE expresion DOSPUNTOS  instrucciones       {$$=AST_Tools.nuevoCaso($2,$4);}
    | DEFAULT DOSPUNTOS  instrucciones              {$$=AST_Tools.nuevoCasoDefault($3);}
    | CASE expresion DOSPUNTOS                      {$$=AST_Tools.nuevoCaso($2,undefined);}
    | DEFAULT DOSPUNTOS                             {$$=AST_Tools.nuevoCasoDefault(undefined);}
;

/* SENTENCIAS DE REPETICION */

bloqueWhile
    : WHILE PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER     {$$= AST_Tools.nuevoWhile($3,$6);}
    | WHILE PARIZQ expresion PARDER LLAVIZQ  LLAVDER                  {$$= AST_Tools.nuevoWhile($3,undefined);}
;

bloqueDoWhile
    : DO LLAVIZQ instrucciones LLAVDER WHILE PARIZQ expresion PARDER PUNTOYCOMA     {$$= AST_Tools.nuevoDoWhile($7,$3);}
    | DO LLAVIZQ LLAVDER WHILE PARIZQ expresion PARDER PUNTOYCOMA                   {$$= AST_Tools.nuevoDoWhile($6,undefined);}
;

bloqueFor
    :FOR PARIZQ asignacion expresion PUNTOYCOMA expresion PARDER LLAVIZQ instrucciones LLAVDER               {$$=AST_Tools.nuevoFor($3,$4,$6,$9);}
    |FOR PARIZQ declaracionAsignacion expresion PUNTOYCOMA expresion PARDER LLAVIZQ instrucciones LLAVDER    {$$=AST_Tools.nuevoFor($3,$4,$6,$9);}
    |FOR PARIZQ asignacion expresion PUNTOYCOMA expresion PARDER LLAVIZQ LLAVDER                             {$$=AST_Tools.nuevoFor($3,$4,$6,undefined);}
    |FOR PARIZQ declaracionAsignacion expresion PUNTOYCOMA expresion PARDER LLAVIZQ LLAVDER                  {$$=AST_Tools.nuevoFor($3,$4,$6,undefined);}
;

bloqueForOf
    : FOR PARIZQ declaracionAsignacionCiclos OF expresion PARDER LLAVIZQ instrucciones LLAVDER  {$$=AST_Tools.nuevoForOf($3,$5,$8);}
    | FOR PARIZQ asignacion OF expresion PARDER LLAVIZQ instrucciones LLAVDER             {$$=AST_Tools.nuevoForOf($3,$5,$8);}
;

bloqueForIn
    : FOR PARIZQ declaracionAsignacionCiclos IN expresion PARDER LLAVIZQ instrucciones LLAVDER  {$$=AST_Tools.nuevoForIn($3,$5,$8);}
    | FOR PARIZQ asignacion IN expresion PARDER LLAVIZQ instrucciones LLAVDER             {$$=AST_Tools.nuevoForIn($3,$5,$8);}
;

//DECLARACIONES Y ASIGNACIONES DENTRO DE CICLOS FOR_OF Y FOR_IN
declaracionAsignacionCiclos
    : LET listaID                    {$$=AST_Tools.declaracion_let($2)}
    | ID IGUAL expresion             {$$=AST_Tools.asignacion($1,$3)}
;