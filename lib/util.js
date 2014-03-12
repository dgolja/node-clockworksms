/**
 * Checks if the given variable is instance of Object.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isObject = module.exports.isObject = function(arg, allowNull) {
  return instanceOf(arg, Object, allowNull);
}

/**
 * Checks if the given variable is instance of Array.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isArray = module.exports.isArray = function(arg, allowNull) {
  return instanceOf(arg, Array, allowNull);
}

/**
 * Checks if the given variable is a string or String object.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isString = module.exports.isString = function(arg, allowNull) {
  if (null == arg) {
    return true == allowNull;
  }

  return arg instanceof String || typeof arg == 'string';
}

/**
 * Checks if the given variable is an boolean or Boolean object.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isBoolean = module.exports.isBoolean = function(arg, allowNull) {
  if (null == arg) {
    return true == allowNull;
  }

  return arg instanceof Boolean || typeof arg == "boolean";
}

/**
 * Checks if the given varaible is an instance of the given type.
 *
 * @param   {Object}    arg
 * @param   {Function}  type
 * @param   {Boolean}   allowNull
 */
var instanceOf = module.exports.instanceOf = function(arg, type, allowNull) {
  if (null == arg) {
    return true == allowNull;
  }

  return arg instanceof type;
}

var has = module.exports.has = function(arg, txt, allowNull) {
  if (null == arg) {
    return true == allowNull;
  }

  for (i=0; i<arg.length; i++) {
    if (arg[i].trim()==txt) return i;
  }
  return false;
}