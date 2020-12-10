String.prototype.trim =  function () {			//Added trim method to string objects
	return this.replace(/^\s+|\s+$/g, '');
};

function tokenize(s){
	return s.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').replace(/\s+/g, ' ').trim().split(' ');
}

function parse(s){
	return interpretTokens(tokenize(s));
}

function interpretTokens(s){
	if(s.length === 0){
		throw{
			name: "SyntaxError",
			message: "unexpected EOF while reading"
		};
	}
	var token = s.shift();		//pop from front
	if(token === '('){
		var L = [];
		while (s[0] !== ')'){
			L.push(interpretTokens(s));
		}
		s.shift();
		return L;
	}
	else if(token === ')'){
		throw{
			name: "SyntaxError",
			message: "unexpected ')'"
		};
	}
	else{
		return atom(token);
	}
}

function atom(token){
	if(isNaN(token))
		return token;
	else
		return +token;
}

function add(a, b) {	return a + b;	}
function sub(a, b) {	return a - b;	}
function mul(a, b) {	return a * b;	}
function div(a, b) {	return a / b;	}
function gt(a, b)  {	return a > b;	}
function lt(a, b)  {	return a < b;	}
function ge(a, b)  {	return a >= b;	}
function le(a, b)  {	return a <= b;	}
function eq(a, b)  {	return a === b;	}
function mod(a, b) {	return a % b;	}

function createEnv(){
	env = {};
	var mathMethods = ['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'random', 'round', 'sin', 'sqrt', 'tan'];
	for (i = 0; i < mathMethods.length; i++) {
		env[mathMethods[i]] = Math[mathMethods[i]];
	}
	env['pi']		 = Math.PI
	env['+']         = add;
	env['-']         = sub;
	env['*']         = mul;
	env['/']         = div;
	env['>']         = gt;
	env['<']         = lt;
	env['>=']		 = ge;
	env['<=']		 = le;
	env['='] 		 = eq;
	env['remainder'] = mod;
	env['equal?']    = eq;
	env['eq?']       = eq;
	env['length']    = function (x) 	{ return x.length; }
	env['cons']      = function (x, y) 	{ var arr = [x]; return arr.concat(y); }
	env['car']       = function (x) 	{ return (x.length !== 0) ? x[0] : null; }
	env['cdr']       = function (x) 	{ return (x.length > 1) ? x.slice(1) : null; }
	env['append']    = function (x, y) 	{ return x.concat(y); }
	env['list']      = function () 		{ return Array.prototype.slice.call(arguments); }
	env['list?']     = function (x) 	{ return x && typeof x === 'object' && x.constructor === Array ; }
	env['null?']     = function (x) 	{ return (!x || x.length === 0); }
	env['symbol?']   = function (x) 	{ return typeof x === 'string'; }
	return env;
}

env = createEnv();

function eval(x){
	if(typeof x === 'string'){
		return env[x];
	}
	else if(typeof x === 'number'){
		return x;
	}
	else if(x[0] === 'quote'){
		return x[1];
	}
	else if (x[0] === 'if'){
		var cond  = x[1];
		var if_   = x[2];
		var else_ = x[3]
		if(eval(cond, env)){
			return eval(if_, env);
		}
		else{
			return eval(else_, env);
		}
	}
	else if(x[0] === 'define'){
		env[x[1]] = eval(x[2], env);
	}
	else{
		proc = eval(x[0], env);
		var exps = [];
		for (i = 0; i < x.length; i += 1) {
		exps[i] = eval(x[i], env);
		}
		var proc = exps.shift();
		try{
			return proc.apply(env, exps);		//func.apply(this, [argsarray])
		}
		catch(e){
			console.log(proc + " is not defined")
		}
	}
}

function readEvalPrint(){
    while(true){
        val = eval(parse(prompt('>schemeJS')));
        if (val !== undefined)
            console.log(schemestr(val));
    }
}

function schemestr(exp) {
    if (typeof exp === 'object' && exp.indexOf(undefined) != -1) {
	return 'Syntax Error'
    }
    if (typeof exp === 'object'){
        return '(' + exp.map(schemestr).join(' ') + ')'
    }
    return String(exp)
}

//Terminal part with jquery

jQuery(function($, undefined) {
    $('#terminal').terminal(function(command, term) {
        if (command !== '') {
            try {
                var result = eval(parse(command));
                if (result !== undefined) {
                    term.echo(schemestr(result));
		}
            } catch(e) {
                term.error('Syntax error resulted in ' + new String(e));
            }
        } else {
           term.echo('');
        }
    }, {
        greetings: 'Elementary Scheme interpreter in JavaScript\n',
        name: 'schemeJS',
        height: $(document).height() - 50,
        prompt: 'schemeJS> '
    });
});


// program = "(begin (define r 10) (* pi (* r r)))"
// console.log(parse(program))
// console.log(eval(parse("(define r 10)")))
// console.log(eval(parse("(* pi (* r r))")))
//readEvalPrint()
