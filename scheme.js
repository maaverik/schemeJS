String.prototype.trim =  function ( ) {		//Added trim method to string objects
	return this.replace(/^\s+|\s+$/g, '');
};

function tokenize(string){
	return string.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').replace(/\s+/g, ' ').trim().split(' ')
}

program = "(begin (define r 10) (* pi (* r r)))"
console.log(tokenize(program))
