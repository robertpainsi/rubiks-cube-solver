# Rubik's Cube solver
This Node.js JavaScript program solves a 3x3 Rubik's Cube by using 4 motors* and features that are only available in Catrobat/Pocket Code. This way it can easily be converted and run on such environment. So some code may look odd or could be much more easily fixed in pure and modern JavaScript.


*(an outdated but functional version only using 2 motors can be found at branch [2-motors](https://github.com/robertpainsi/rubiks-cube-solver/tree/2-motors))

### Setup
```
npm install
```

### Run
```
npm start
```

### Limitations because of Catrobat/Pocket Code and other notes:

- Read all `TODO` comments in `src/index.js` and adapt your Catrobat/Pocket Code code accordingly.

- By using `Proxy`s and `createList`, JavaScript arrays (lists) start at index 1 now, as they do in Catrobat/Pocket Code.

  Currently only a few JavaScript array features are supported:
  - get/set/delete by index
  - push

  Unknown or incorrect behavior for arrays:
  - get/set/delete if index is not a `Number`, negative integer or the index is out of bounce (> length).

- Arrays are only one-dimensional.

- Arrays can't be assigned to variables because they will be stringified (`variable = array.join(' ');`).

- Some methods are only used for output, verification and similar. Every method that isn't declared in `src/index.js` is optional and can be skipped when translated to Catrobat/Pocket Code. `src/pocket-code.js` implements features that are supported out of the box in Catrobat/Pocket Code but not in JavaScript.

- The global context `$` stores all program variables accessible by all objects at all time.
