String.prototype.trim =  function () {			//Added trim method to string objects
	return this.replace(/^\s+|\s+$/g, '');
};

function tokenize(s){
	return s.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').replace(/\s+/g, ' ').trim().split(' ');
}

function parse(s){
	return interpretTokens(tokenize(s));
}

function atom(token){
	if(isNaN(token))
		return token;
	else
		return +token;
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

program = "(begin (define r 10) (* pi (* r r)))"
console.log(parse(program))
