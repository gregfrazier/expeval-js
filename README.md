# expeval-js
Infix Expression Evaluator for JavaScript

Usage:

```javascript
evaluator('1 + 5 * 2');

output: 11
```



```javascript
evaluator('(1 + 5) * 2');

output: 12
```


```javascript
evaluator('1 + 5 * two', { two: 2 });

output: 11
```

Concatenation side effects:
```javascript
evaluator('two + 1 + 5', { two: '2' });

output: "215"
```
But
```javascript
evaluator('two * 1 + 5', { two: '2' });

output: 7
```
