(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
	  return it && it.Math === Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global$a =
	// eslint-disable-next-line es/no-global-this -- safe
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) ||
	// eslint-disable-next-line no-restricted-globals -- safe
	check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	// eslint-disable-next-line no-new-func -- fallback
	function () {
	  return this;
	}() || Function('return this')();

	var shared$3 = {exports: {}};

	var global$9 = global$a;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$1 = Object.defineProperty;
	var defineGlobalProperty$2 = function (key, value) {
	  try {
	    defineProperty$1(global$9, key, {
	      value: value,
	      configurable: true,
	      writable: true
	    });
	  } catch (error) {
	    global$9[key] = value;
	  }
	  return value;
	};

	var global$8 = global$a;
	var defineGlobalProperty$1 = defineGlobalProperty$2;
	var SHARED = '__core-js_shared__';
	var store$3 = global$8[SHARED] || defineGlobalProperty$1(SHARED, {});
	var sharedStore = store$3;

	var store$2 = sharedStore;
	(shared$3.exports = function (key, value) {
	  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.35.1',
	  mode: 'global',
	  copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.35.1/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});
	var sharedExports = shared$3.exports;

	var fails$6 = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$5 = fails$6;
	var functionBindNative = !fails$5(function () {
	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
	  var test = function () {/* empty */}.bind();
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});

	var NATIVE_BIND$1 = functionBindNative;
	var FunctionPrototype$1 = Function.prototype;
	var call$3 = FunctionPrototype$1.call;
	var uncurryThisWithBind = NATIVE_BIND$1 && FunctionPrototype$1.bind.bind(call$3, call$3);
	var functionUncurryThis = NATIVE_BIND$1 ? uncurryThisWithBind : function (fn) {
	  return function () {
	    return call$3.apply(fn, arguments);
	  };
	};

	// we can't use just `it == null` since of `document.all` special case
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
	var isNullOrUndefined$2 = function (it) {
	  return it === null || it === undefined;
	};

	var isNullOrUndefined$1 = isNullOrUndefined$2;
	var $TypeError$5 = TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible$1 = function (it) {
	  if (isNullOrUndefined$1(it)) throw new $TypeError$5("Can't call method on " + it);
	  return it;
	};

	var requireObjectCoercible = requireObjectCoercible$1;
	var $Object$2 = Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject$1 = function (argument) {
	  return $Object$2(requireObjectCoercible(argument));
	};

	var uncurryThis$5 = functionUncurryThis;
	var toObject = toObject$1;
	var hasOwnProperty = uncurryThis$5({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es/no-object-hasown -- safe
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject(it), key);
	};

	var uncurryThis$4 = functionUncurryThis;
	var id = 0;
	var postfix = Math.random();
	var toString$2 = uncurryThis$4(1.0.toString);
	var uid$2 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$2(++id + postfix, 36);
	};

	var engineUserAgent = typeof navigator != 'undefined' && String(navigator.userAgent) || '';

	var global$7 = global$a;
	var userAgent = engineUserAgent;
	var process = global$7.process;
	var Deno = global$7.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;
	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && userAgent) {
	  match = userAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = userAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}
	var engineV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */
	var V8_VERSION = engineV8Version;
	var fails$4 = fails$6;
	var global$6 = global$a;
	var $String$3 = global$6.String;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$4(function () {
	  var symbol = Symbol('symbol detection');
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
	  // of course, fail.
	  return !$String$3(symbol) || !(Object(symbol) instanceof Symbol) ||
	  // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	  !Symbol.sham && V8_VERSION && V8_VERSION < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */
	var NATIVE_SYMBOL$1 = symbolConstructorDetection;
	var useSymbolAsUid = NATIVE_SYMBOL$1 && !Symbol.sham && typeof Symbol.iterator == 'symbol';

	var global$5 = global$a;
	var shared$2 = sharedExports;
	var hasOwn$3 = hasOwnProperty_1;
	var uid$1 = uid$2;
	var NATIVE_SYMBOL = symbolConstructorDetection;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
	var Symbol$1 = global$5.Symbol;
	var WellKnownSymbolsStore = shared$2('wks');
	var createWellKnownSymbol = USE_SYMBOL_AS_UID$1 ? Symbol$1['for'] || Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;
	var wellKnownSymbol$3 = function (name) {
	  if (!hasOwn$3(WellKnownSymbolsStore, name)) {
	    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn$3(Symbol$1, name) ? Symbol$1[name] : createWellKnownSymbol('Symbol.' + name);
	  }
	  return WellKnownSymbolsStore[name];
	};

	var wellKnownSymbol$2 = wellKnownSymbol$3;
	var TO_STRING_TAG$1 = wellKnownSymbol$2('toStringTag');
	var test = {};
	test[TO_STRING_TAG$1] = 'z';
	var toStringTagSupport = String(test) === '[object z]';

	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
	var documentAll = typeof document == 'object' && document.all;

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
	var isCallable$a = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
	  return typeof argument == 'function' || argument === documentAll;
	} : function (argument) {
	  return typeof argument == 'function';
	};

	var objectDefineProperty = {};

	var fails$3 = fails$6;

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails$3(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] !== 7;
	});

	var isCallable$9 = isCallable$a;
	var isObject$4 = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable$9(it);
	};

	var global$4 = global$a;
	var isObject$3 = isObject$4;
	var document$1 = global$4.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS$1 = isObject$3(document$1) && isObject$3(document$1.createElement);
	var documentCreateElement = function (it) {
	  return EXISTS$1 ? document$1.createElement(it) : {};
	};

	var DESCRIPTORS$5 = descriptors;
	var fails$2 = fails$6;
	var createElement = documentCreateElement;

	// Thanks to IE8 for its funny defineProperty
	var ie8DomDefine = !DESCRIPTORS$5 && !fails$2(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(createElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a !== 7;
	});

	var DESCRIPTORS$4 = descriptors;
	var fails$1 = fails$6;

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	var v8PrototypeDefineBug = DESCRIPTORS$4 && fails$1(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () {/* empty */}, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype !== 42;
	});

	var isObject$2 = isObject$4;
	var $String$2 = String;
	var $TypeError$4 = TypeError;

	// `Assert: Type(argument) is Object`
	var anObject$1 = function (argument) {
	  if (isObject$2(argument)) return argument;
	  throw new $TypeError$4($String$2(argument) + ' is not an object');
	};

	var NATIVE_BIND = functionBindNative;
	var call$2 = Function.prototype.call;
	var functionCall = NATIVE_BIND ? call$2.bind(call$2) : function () {
	  return call$2.apply(call$2, arguments);
	};

	var global$3 = global$a;
	var isCallable$8 = isCallable$a;
	var aFunction = function (argument) {
	  return isCallable$8(argument) ? argument : undefined;
	};
	var getBuiltIn$1 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$3[namespace]) : global$3[namespace] && global$3[namespace][method];
	};

	var uncurryThis$3 = functionUncurryThis;
	var objectIsPrototypeOf = uncurryThis$3({}.isPrototypeOf);

	var getBuiltIn = getBuiltIn$1;
	var isCallable$7 = isCallable$a;
	var isPrototypeOf = objectIsPrototypeOf;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;
	var $Object$1 = Object;
	var isSymbol$2 = USE_SYMBOL_AS_UID ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn('Symbol');
	  return isCallable$7($Symbol) && isPrototypeOf($Symbol.prototype, $Object$1(it));
	};

	var $String$1 = String;
	var tryToString$1 = function (argument) {
	  try {
	    return $String$1(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var isCallable$6 = isCallable$a;
	var tryToString = tryToString$1;
	var $TypeError$3 = TypeError;

	// `Assert: IsCallable(argument) is true`
	var aCallable$1 = function (argument) {
	  if (isCallable$6(argument)) return argument;
	  throw new $TypeError$3(tryToString(argument) + ' is not a function');
	};

	var aCallable = aCallable$1;
	var isNullOrUndefined = isNullOrUndefined$2;

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod$1 = function (V, P) {
	  var func = V[P];
	  return isNullOrUndefined(func) ? undefined : aCallable(func);
	};

	var call$1 = functionCall;
	var isCallable$5 = isCallable$a;
	var isObject$1 = isObject$4;
	var $TypeError$2 = TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$5(fn = input.toString) && !isObject$1(val = call$1(fn, input))) return val;
	  if (isCallable$5(fn = input.valueOf) && !isObject$1(val = call$1(fn, input))) return val;
	  if (pref !== 'string' && isCallable$5(fn = input.toString) && !isObject$1(val = call$1(fn, input))) return val;
	  throw new $TypeError$2("Can't convert object to primitive value");
	};

	var call = functionCall;
	var isObject = isObject$4;
	var isSymbol$1 = isSymbol$2;
	var getMethod = getMethod$1;
	var ordinaryToPrimitive = ordinaryToPrimitive$1;
	var wellKnownSymbol$1 = wellKnownSymbol$3;
	var $TypeError$1 = TypeError;
	var TO_PRIMITIVE = wellKnownSymbol$1('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive$1 = function (input, pref) {
	  if (!isObject(input) || isSymbol$1(input)) return input;
	  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call(exoticToPrim, input, pref);
	    if (!isObject(result) || isSymbol$1(result)) return result;
	    throw new $TypeError$1("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive = toPrimitive$1;
	var isSymbol = isSymbol$2;

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey$1 = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var DESCRIPTORS$3 = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
	var anObject = anObject$1;
	var toPropertyKey = toPropertyKey$1;
	var $TypeError = TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE$1 = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS$3 ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor(O, P);
	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  }
	  return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) {/* empty */}
	  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var makeBuiltIn$2 = {exports: {}};

	var DESCRIPTORS$2 = descriptors;
	var hasOwn$2 = hasOwnProperty_1;
	var FunctionPrototype = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = DESCRIPTORS$2 && Object.getOwnPropertyDescriptor;
	var EXISTS = hasOwn$2(FunctionPrototype, 'name');
	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$2 || DESCRIPTORS$2 && getDescriptor(FunctionPrototype, 'name').configurable);
	var functionName = {
	  CONFIGURABLE: CONFIGURABLE
	};

	var uncurryThis$2 = functionUncurryThis;
	var isCallable$4 = isCallable$a;
	var store$1 = sharedStore;
	var functionToString = uncurryThis$2(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable$4(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}
	var inspectSource$1 = store$1.inspectSource;

	var global$2 = global$a;
	var isCallable$3 = isCallable$a;
	var WeakMap$1 = global$2.WeakMap;
	var weakMapBasicDetection = isCallable$3(WeakMap$1) && /native code/.test(String(WeakMap$1));

	var createPropertyDescriptor$1 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var DESCRIPTORS$1 = descriptors;
	var definePropertyModule$1 = objectDefineProperty;
	var createPropertyDescriptor = createPropertyDescriptor$1;
	var createNonEnumerableProperty$1 = DESCRIPTORS$1 ? function (object, key, value) {
	  return definePropertyModule$1.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var shared$1 = sharedExports;
	var uid = uid$2;
	var keys = shared$1('keys');
	var sharedKey$1 = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var NATIVE_WEAK_MAP = weakMapBasicDetection;
	var global$1 = global$a;
	var createNonEnumerableProperty = createNonEnumerableProperty$1;
	var hasOwn$1 = hasOwnProperty_1;
	var shared = sharedStore;
	var sharedKey = sharedKey$1;
	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$1 = global$1.TypeError;
	var WeakMap = global$1.WeakMap;
	var set, get, has;
	var enforce = function (it) {
	  return has(it) ? get(it) : set(it, {});
	};
	if (NATIVE_WEAK_MAP || shared.state) {
	  var store = shared.state || (shared.state = new WeakMap());
	  /* eslint-disable no-self-assign -- prototype methods protection */
	  store.get = store.get;
	  store.has = store.has;
	  store.set = store.set;
	  /* eslint-enable no-self-assign -- prototype methods protection */
	  set = function (it, metadata) {
	    if (store.has(it)) throw new TypeError$1(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    store.set(it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return store.get(it) || {};
	  };
	  has = function (it) {
	    return store.has(it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  set = function (it, metadata) {
	    if (hasOwn$1(it, STATE)) throw new TypeError$1(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return hasOwn$1(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwn$1(it, STATE);
	  };
	}
	var internalState = {
	  get: get,
	  enforce: enforce};

	var uncurryThis$1 = functionUncurryThis;
	var fails = fails$6;
	var isCallable$2 = isCallable$a;
	var hasOwn = hasOwnProperty_1;
	var DESCRIPTORS = descriptors;
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
	var inspectSource = inspectSource$1;
	var InternalStateModule = internalState;
	var enforceInternalState = InternalStateModule.enforce;
	var getInternalState = InternalStateModule.get;
	var $String = String;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty = Object.defineProperty;
	var stringSlice$1 = uncurryThis$1(''.slice);
	var replace = uncurryThis$1(''.replace);
	var join = uncurryThis$1([].join);
	var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
	  return defineProperty(function () {/* empty */}, 'length', {
	    value: 8
	  }).length !== 8;
	});
	var TEMPLATE = String(String).split('String');
	var makeBuiltIn$1 = makeBuiltIn$2.exports = function (value, name, options) {
	  if (stringSlice$1($String(name), 0, 7) === 'Symbol(') {
	    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
	  }
	  if (options && options.getter) name = 'get ' + name;
	  if (options && options.setter) name = 'set ' + name;
	  if (!hasOwn(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
	    if (DESCRIPTORS) defineProperty(value, 'name', {
	      value: name,
	      configurable: true
	    });else value.name = name;
	  }
	  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
	    defineProperty(value, 'length', {
	      value: options.arity
	    });
	  }
	  try {
	    if (options && hasOwn(options, 'constructor') && options.constructor) {
	      if (DESCRIPTORS) defineProperty(value, 'prototype', {
	        writable: false
	      });
	      // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
	    } else if (value.prototype) value.prototype = undefined;
	  } catch (error) {/* empty */}
	  var state = enforceInternalState(value);
	  if (!hasOwn(state, 'source')) {
	    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
	  }
	  return value;
	};

	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	// eslint-disable-next-line no-extend-native -- required
	Function.prototype.toString = makeBuiltIn$1(function toString() {
	  return isCallable$2(this) && getInternalState(this).source || inspectSource(this);
	}, 'toString');
	var makeBuiltInExports = makeBuiltIn$2.exports;

	var isCallable$1 = isCallable$a;
	var definePropertyModule = objectDefineProperty;
	var makeBuiltIn = makeBuiltInExports;
	var defineGlobalProperty = defineGlobalProperty$2;
	var defineBuiltIn$1 = function (O, key, value, options) {
	  if (!options) options = {};
	  var simple = options.enumerable;
	  var name = options.name !== undefined ? options.name : key;
	  if (isCallable$1(value)) makeBuiltIn(value, name, options);
	  if (options.global) {
	    if (simple) O[key] = value;else defineGlobalProperty(key, value);
	  } else {
	    try {
	      if (!options.unsafe) delete O[key];else if (O[key]) simple = true;
	    } catch (error) {/* empty */}
	    if (simple) O[key] = value;else definePropertyModule.f(O, key, {
	      value: value,
	      enumerable: false,
	      configurable: !options.nonConfigurable,
	      writable: !options.nonWritable
	    });
	  }
	  return O;
	};

	var uncurryThis = functionUncurryThis;
	var toString$1 = uncurryThis({}.toString);
	var stringSlice = uncurryThis(''.slice);
	var classofRaw$1 = function (it) {
	  return stringSlice(toString$1(it), 8, -1);
	};

	var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
	var isCallable = isCallable$a;
	var classofRaw = classofRaw$1;
	var wellKnownSymbol = wellKnownSymbol$3;
	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var $Object = Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () {
	  return arguments;
	}()) === 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) {/* empty */}
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof$1 = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	  // @@toStringTag case
	  : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
	  // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw(O)
	  // ES3 arguments fallback
	  : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	};

	var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
	var classof = classof$1;

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var defineBuiltIn = defineBuiltIn$1;
	var toString = objectToString;

	// `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	if (!TO_STRING_TAG_SUPPORT) {
	  defineBuiltIn(Object.prototype, 'toString', toString, {
	    unsafe: true
	  });
	}

	/**
	 * ESModules 形式のモジュール
	 *
	 * @return {void}
	 */
	function esModule() {
	  // eslint-disable-next-line no-console
	  console.log('This is ES Module.');
	}

	/**
	 * Common JS 形式のモジュール
	 *
	 * @return {void}
	 */
	var cjs = function commonJsModule() {
	  // eslint-disable-next-line no-console
	  console.log('This is Common JS Module.');
	};

	esModule();
	cjs();

	// apply polyfill for ie8
	// eslint-disable-next-line no-console
	[].forEach(function (item) {
	  return console.log(item);
	});

})();
