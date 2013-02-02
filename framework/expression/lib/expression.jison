/* description: Parses end executes mathematical expressions. */
/*\"([^"\\]|(\\"))*\"         return 'STRING'
\'([^'\\]|(\\'))*\'         return 'SSTRING'*/
/* lexical grammar */


%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
[a-z]+([a-zA-Z0-9]*)  return 'KEYWORD'
\"[^"]*\"             return 'STRING'
\'[^']*\'             return 'SSTRING'
">>>="                  return '>>>='
"<<="                  return '<<='
">>="                  return '>>='
">>>"                  return '>>>'
"==="                  return '==='
"!=="                  return '!=='
"&&"                  return '&&'
"||"                  return '||'
"="                  return '='
"+="                  return '+='
"-="                  return '-='
"*="                  return '*='
"/="                  return '/='
"%="                  return '%='
"&="                  return '&='
"!="                  return '!='
"++"                  return '++'
"--"                  return '--'
"<<"                  return '<<'
">>"                  return '>>'
"<="                  return '<='
">="                  return '>='
"in"                  return 'in'
"=="                  return '=='
"!="                  return '!='
">"                  return '>'
"<"                  return '<'
"!"                  return '!'
"~"                  return '~'
"*"                  return '*'
"/"                  return '/'
"%"                  return '%'
"+"                  return '+'
"-"                  return '-'
"&"                  return '&'
"^"                  return '^'
"|"                  return '|'
"."                   return '.'
","                   return ','
":"                   return ':'
"["                   return '['
"]"                   return ']'
"{"                   return '{'
"}"                   return '}'
"("                   return '('
")"                   return ')'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */
%right '+=' '-=' '*=' '/=' '%=' '<<=' '>>=' '>>>=' '&=' '|='
%right '='
%left '||'
%left '&&'
%left '|'
%left '^'
%left '&'
%left '==' '!=' '===' '!=='
%left 'in'
%left '<' '<=' '>' '>='
%left '<<' '>>' '>>>'
%left '+' '-'
%left '*' '/' '%'
%right '!' '~'
%nonassoc '++' '--'
%left '.' ','
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { return $1; }
    ;

arglist
    : e
        { $$ = [$1]; }
    | arglist ',' e
        { $$ = $1.slice(); $$.push($3); }
    ;

array
    : '[' ']'
        { $$ = []; }
    | '[' arglist ']'
        { $$ = $2; }
    ;

string
    : STRING
        { $$ = yytext.slice(1, -1); }
    | SSTRING
        { $$ = yytext.slice(1, -1); }
    ;

objectMember
    : KEYWORD ':' e
        { $$ = { name: $1, value: $3 }; }
    | string ':' e,
        { $$ = { name: $1, value: $3 }; }
    ;

objectMembers
    : objectMember
        { $$ = [$1]; }
    | objectMembers ',' objectMember
        { $1.push($3); $$ = $1; }
    ;

object
    : '{' '}'
        { $$ = {}; }
    | '{' objectMembers '}'
        {
            $$ = (function () {
                var o = {},
                    i,
                    l = $2.length,
                    memb;
                for (i = 0; i < l; i += 1) {
                    memb = $2[i];
                    o[memb.name] = memb.value;
                }
                return o;
            }());
        }
    ;

lvalue
    : KEYWORD
        { $$ = { value: yy.scope[yytext], prop: yytext, object: yy.scope }}
    | e '.' KEYWORD
        { $$ = { value: $1[$3], prop: $3, object: $1 }; }
    | e '[' e ']'
        { $$ = { value: $1[$3], prop: $3, object: $1 }; }
    ;
e
    : NUMBER
        {$$ = Number(yytext); }
    | lvalue
        { $$ = $1.value }
    | string
        { $$ = yytext.slice(1, -1); }
    | array
        { $$ = $1; }
    | lvalue '(' ')'
        { $$ = $1.value.call($1.object); }
    | lvalue '(' arglist ')'
        { $$ = $1.value.apply($1.object, $3); }
    | e '(' ')'
        { $$ = $1(); }
    | e '(' arglist ')'
        { $$ = $1.apply(null, $3); }
    | '(' e ')'
        { $$ = $2; }
    | object
        { $$ = $1; }
    | e '++'
        { $$ = $1++; }
    | '-' e
        { $$ = -$2; }
    | e '--'
        { $$ = $1 --; }
    | '!' e
        { $$ = ! $2; }
    | '~' e
        { $$ = ~$2; }
    | e '*' e
        { $$ = $1 * $3; }
    | e '/' e
        { $$ = $1 / $3; }
    | e  '%' e
        { $$ = $1 % $3; }
    | e '+' e
        { $$ = $1 + $3; }
    | e '-' e
        { $$ = $1 - $3; }
    | e '<<' e
        { $$ = $1 << $3; }
    | e '>>' e
        { $$ = $1 >> $3; }
    | e '>>>' e
        { $$ = $1 >>> $3; }
    | e '<' e
        { $$ = $1 < $3; }
    | e '<=' e
        { $$ = $1 <= $3; }
    | e '>' e
        { $$ = $1 > $3; }
    | e '>=' e
        { $$ = $1 >= $3; }
    | e 'in' e
        { $$ = $1 in $3; }
    | e '==' e
        { $$ = $1 == $3; }
    | e '!=' e
        { $$ = $1 != $3; }
    | e '===' e
        { $$ = $1 === $3; }
    | e '!==' e
        { $$ = $1 !== $3; }
    | e '&' e
        { $$ = $1 & $3; }
    | e '^' e
        { $$ = $1 ^ $3; }
    | e '|' e
        { $$ = $1 | $3; }
    | e '&&' e
        { $$ = $1 && $3; }
    | e '||' e
        { $$ = $1 || $3; }
    | lvalue '=' e
        { $$ = $1.object[$1.prop] = $3; }
    | lvalue '+=' e
        { $$ = ($1.object[$1.prop] += $3); }
    | lvalue '-=' e
        { $$ = ($1.object[$1.prop] -= $3); }
    | lvalue '*=' e
        { $$ = ($1.object[$1.prop] *= $3); }
    | lvalue '/=' e
        { $$ = ($1.object[$1.prop] /= $3); }
    | lvalue '%=' e
        { $$ = ($1.object[$1.prop] %= $3); }
    | lvalue '<<=' e
        { $$ = ($1.object[$1.prop] <<= $3); }
    | lvalue '>>=' e
        { $$ = ($1.object[$1.prop] >>= $3); }
    | lvalue '>>>=' e
        { $$ = ($1.object[$1.prop] >>>= $3); }
    | lvalue '&=' e
        { $$ = ($1.object[$1.prop] &= $3); }
    | lvalue '|=' e
        { $$ = ($1.object[$1.prop] |= $3); }
    ;
