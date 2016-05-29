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

function standardEnv(){
	env = {};
	var mathMethods = ['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'random', 'round', 'sin', 'sqrt', 'tan'];
	for (i = 0; i < mathMethods.length; i++) {
		env[mathMethods[i]] = Math[mathMethods[i]];
	}
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

program = "(begin (define r 10) (* pi (* r r)))"
console.log(parse(program))
