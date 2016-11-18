var evaluator = function(str, scope){
	var valueStack = [], operStack = [],
		e = { '+': function(y,x){ return x + y; }, '-': function(y,x){ return x - y; }, '*': function(y,x){ return x * y; }, '/': function(y,x){ return x / y; } },
		prec = function(op1, op2){ return (op2 == '(' || op2 == ')') || ((op1 == '*' || op1 == '/') && (op2 == '+' || op2 == '-')) ? false : true; }, 
		validOps = ['+','-','*','/','!','(',')'];
	Array.from(str).map(function(curr){
		return validOps.indexOf(curr)> -1 ? { type: 'o', val: curr  } : curr.trim().length === 0 ? { type: 'w', val: curr } : { type: 'l', val: curr };
	}).reduce(function(prev, curr, idx, arr){
		var proc = {
		 	l: function(p){
				if(p.type == 'l') p.literalValue += String(curr.val);
					else prev.push({ type: curr.type, literalValue: String(curr.val) });
			},
			o: function(p){ prev.push({ type: curr.type, operatorValue: String(curr.val), equality: false }); },
			w: function(){ return; }
		}; proc[curr.type](prev[prev.length-1]);
		return prev;
	}, [{ type: 's' }]).forEach(function(o){
		var proc = {
			s: function(){},
			l: function(){
				var v = /[0-9]/i.test(o.literalValue.charAt(0)) ? parseFloat(o.literalValue) : scope[o.literalValue];
				if(operStack[operStack.length-1] == '!'){ v = !v; operStack.pop(); }
				valueStack.push(v);
			},
			o: function(){
				var operate = function() {
					if(operStack[operStack.length-1] in e && valueStack.length > 1) valueStack.push(e[operStack.pop()](valueStack.pop(), valueStack.pop()));
						else operStack.pop();
				};
				switch(o.operatorValue) {
					case '!': case '(': operStack.push( o.operatorValue ); break;
					case '+': case '-': case '*': case '/':
						while(operStack.length > 0 && prec(o.operatorValue, operStack[operStack.length-1])) operate();
						operStack.push( o.operatorValue );
						break;
					case ')':
						while(operStack.length > 0 && operStack[operStack.length-1] != '(') operate();
						operStack.pop();
						break;
				}
			}
		}; proc[o.type]();
	});
	while(operStack.length > 0)
		if(operStack[operStack.length-1] in e && valueStack.length > 1) valueStack.push(e[operStack.pop()](valueStack.pop(), valueStack.pop()));
			else operStack.pop();	
	return valueStack.pop();
};
