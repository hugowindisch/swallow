/**
    expression.jison
    Copyright (C) 2013 Hugo Windisch

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.
*/


/* description: Parses end executes mathematical expressions. */
/*\"([^"\\]|(\\"))*\"         return 'STRING'
\'([^'\\]|(\\'))*\'         return 'SSTRING'*/
/* lexical grammar */


%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
[a-z$_]+([a-zA-Z$_0-9]*)  return 'KEYWORD'
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
        { $$ = function () { return [$1()]; }; }
    | arglist ',' e
        { $$ = function () { var a = $1().slice(); a.push($3()); return a; } }
    ;

array
    : '[' ']'
        { $$ = function () { return []; }; }
    | '[' arglist ']'
        { $$ = $2; }
    ;

string
    : STRING
        { $$ = yy.constant(yytext.slice(1, -1)); }
    | SSTRING
        { $$ = yy.constant(yytext.slice(1, -1)); }
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
        { $$ = function () { return {}; }; }
    | '{' objectMembers '}'
        {
            $$ = function () {
                var o = {},
                    i,
                    l = $2.length,
                    memb;
                for (i = 0; i < l; i += 1) {
                    memb = $2[i];
                    o[memb.name()] = memb.value();
                }
                return o;
            };
        }
    ;

lvalue
    : KEYWORD
        {
            $$ = { value: yy.resolveGlobal(yy.getScope, yytext), prop: yytext, object: yy.getScope }}
    | e '.' KEYWORD
        { $$ = { value: yy.resolve($1, $3), prop: $3, object: $1 }; }
    | e '[' e ']'
        { $$ = { value: yy.resolve($1, $3), prop: $3, object: $1 }; }
    ;
e
    : NUMBER
        {$$ = yy.constant(Number(yytext)); }
    | lvalue
        { $$ = $1.value }
    | string
        { $$ = yy.constant(yytext.slice(1, -1)); }
    | array
        { $$ = $1; }
    | lvalue '(' ')'
        { $$ = function () { return $1.value().call($1.object()); }; }
    | lvalue '(' arglist ')'
        { $$ = function () { return $1.value().apply($1.object(), $3()); }; }
    | e '(' ')'
        { $$ = function () { return $1()(); }; }
    | e '(' arglist ')'
        { $$ = function () { return $1().apply(null, $3()); }; }
    | '(' e ')'
        { $$ = $2; }
    | object
        { $$ = $1; }
    | lvalue '++'
        { $$ = function () { return $1.object()[$1.prop]++; }; }
    | '-' e
        { $$ = function () { return -$2(); }; }
    | lvalue '--'
        { $$ = function () { return $1.object()[$1.prop]--; }; }
    | '!' e
        { $$ = function () { return ! $2(); }; }
    | '~' e
        { $$ = function () { return ~($2()); }; }
    | e '*' e
        { $$ = function () { return $1() * $3(); }; }
    | e '/' e
        { $$ = function () { return $1() / $3(); }; }
    | e  '%' e
        { $$ = function () { return $1() % $3(); }; }
    | e '+' e
        { $$ = function () { return $1() + $3(); }; }
    | e '-' e
        { $$ = function () { return $1() - $3(); }; }
    | e '<<' e
        { $$ = function () { return $1() << $3(); }; }
    | e '>>' e
        { $$ = function () { return $1() >> $3(); }; }
    | e '>>>' e
        { $$ = function () { return $1() >>> $3(); }; }
    | e '<' e
        { $$ = function () { return $1() < $3(); }; }
    | e '<=' e
        { $$ = function () { return $1() <= $3(); }; }
    | e '>' e
        { $$ = function () { return $1() > $3(); }; }
    | e '>=' e
        { $$ = function () { return $1() >= $3(); }; }
    | e 'in' e
        { $$ = function () { return $1() in $3(); }; }
    | e '==' e
        { $$ = function () { return $1() == $3(); }; }
    | e '!=' e
        { $$ = function () { return $1() != $3(); }; }
    | e '===' e
        { $$ = function () { return $1() === $3(); }; }
    | e '!==' e
        { $$ = function () { return $1() !== $3(); }; }
    | e '&' e
        { $$ = function () { return $1() & $3(); }; }
    | e '^' e
        { $$ = function () { return $1() ^ $3(); }; }
    | e '|' e
        { $$ = function () { return $1() | $3(); }; }
    | e '&&' e
        { $$ = function () { return $1() && $3(); }; }
    | e '||' e
        { $$ = function () { return $1() || $3(); }; }
    | lvalue '=' e
        { $$ = yy.assignment(function () { return $1.object()[$1.prop] = $3(); }); }
    | lvalue '+=' e
        { $$ = yy.assignment(function () { return $1.object()[$1.prop] += $3(); }); }
    | lvalue '-=' e
        { $$ = yy.assignment(function () { return $1.object()[$1.prop] -= $3(); }); }
    | lvalue '*=' e
        { $$ = yy.assignment(function () { return $1.object()[$1.prop] *= $3(); }); }
    | lvalue '/=' e
        { $$ = yy.assignment(function () { return $1.object()[$1.prop] /= $3(); }); }
    | lvalue '%=' e
        { $$ = yy.assignment(function () { return $1.object()[$1.prop] %= $3(); }); }
    | lvalue '<<=' e
        { $$ = yy.assignment(function () { return $1.object()[$1.prop] <<= $3(); }); }
    | lvalue '>>=' e
        { $$ = yy.assignment(function () { return $1.object()[$1.prop] >>= $3(); }); }
    | lvalue '>>>=' e
        { $$ = yy.assignment(function () { return $1.object()[$1.prop] >>>= $3(); }); }
    | lvalue '&=' e
        { $$ = yy.assignment(function () { return $1.object()[$1.prop] &= $3(); }); }
    | lvalue '|=' e
        { $$ = yy.assignment(function () { return $1.object()[$1.prop] |= $3(); }); }
    ;
