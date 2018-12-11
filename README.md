`signajs` - Javascript Event/Signal to any object
==================================================


Pronounced "signays"



Usage
-----

Use as external library.

```javascript
a = {'a':1, 'b':2}
signajs.connect(a, 'touched', function(data) {
    console.log("Have been touched!", data);
})

signajs.signal(a, 'touched', [1,2,3];
```


Use as extension of object.

```javascript
A = function A() {
}

A.prototype = Object.create(signajs.SignaledObject);

a = new A()
a.on('touched', function(data) {
    console.log("Have been touched!", data);
})

a.fire('touched', [1,2,3];
```
