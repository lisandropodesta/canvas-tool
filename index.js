/**
 * Dependencies
 */

var autoscale = require( 'autoscale-canvas' );
var type = require( 'type-tool' );

/**
 * External references
 */

var isString = type.isString;
var isFunction = type.isFunction;

/**
 * Exports
 */

module.exports.getAttr = getAttr;
module.exports.getContext = getContext;
module.exports.getPrimitives = getPrimitives;

/**
 * Canvas attributes dictionary
 */

var CANVAS_ATTR = {
  // Colors, Styles and Shadows
  fillStyle: 'fillStyle',
  strokeStyle: 'strokeStyle',
  shadowColor: 'shadowColor',
  shadowBlur: 'shadowBlur',
  shadowOffsetX: 'shadowOffsetX',
  shadowOffsetY: 'shadowOffsetY',

  // Line styles
  lineCap: 'lineCap',
  lineJoin: 'lineJoin',
  lineWidth: 'lineWidth',
  miterLimit: 'miterLimit',

  // Text
  font: 'font',
  textAlign: 'textAlign',
  textBaseline: 'textBaseline'
};

/**
 * Gets an attribute name from a keyword
 *
 * @param {string} k Keyword
 * @return {string} Attribute name
 * @api public
 */

function getAttr( k ) {
  return CANVAS_ATTR[ k ];
}

/**
 * Gets canvas context from one canvas element or its ID
 *
 * @param {element|string} target Target canvas element or target canvas element ID
 * @return {context} Canvas context
 * @api public
 */

function getContext( target ) {

  // Get canvas element
  var cv = ( isString( target ) ?
    cv = document.getElementById( target ) :
    target );

  // CanvasPrimitives emulates context
  if ( cv instanceof CanvasPrimitives ) {
    return cv;
  }

  // Auto scale
  if ( cv ) {
    autoscale( cv );
  }

  // Get canvas context
  return ( cv && cv.getContext && cv.getContext( '2d' ) );
}

/**
 * Get a painting primitives storage object
 *
 * @return {CanvasPrimitives} Canvas primitives container
 * @api public
 */

function getPrimitives() {
  return new CanvasPrimitives();
}

/**
 * Primitives class function
 *
 * @return {CanvasPrimitives} Canvas primitives container
 * @api public
 */

function CanvasPrimitives() {
  this.array = [];
  this.tmpArray = [];
}

/**
 * Canvas.beginPath emulator
 *
 * @api public
 */

CanvasPrimitives.prototype.beginPath = function () {
  this.tmpArray.push( { fn: 'beginPath' } );
}

/**
 * Canvas.closePath emulator
 *
 * @api public
 */

CanvasPrimitives.prototype.closePath = function () {
  this.tmpArray.push( { fn: 'closePath' } );
}

/**
 * Canvas.moveTo emulator
 *
 * @api public
 */

CanvasPrimitives.prototype.moveTo = function ( x, y ) {
  this.tmpArray.push( { fn: 'moveTo', params: [ x, y ] } );
}

/**
 * Canvas.lineTo emulator
 *
 * @api public
 */

CanvasPrimitives.prototype.lineTo = function ( x, y ) {
  this.tmpArray.push( { fn: 'lineTo', params: [ x, y ] } );
}

/**
 * Canvas.fill emulator
 *
 * @api public
 */

CanvasPrimitives.prototype.fill = function () {
  this.tmpArray.push( { fn: 'fill' } );
}

/**
 * Canvas.rect emulator
 *
 * @api public
 */

CanvasPrimitives.prototype.rect = function ( x, y, width, height ) {
  this.tmpArray.push( { fn: 'rect', params: [ x, y, width, height ] } );
}

/**
 * Canvas.arc emulator
 *
 * @api public
 */

CanvasPrimitives.prototype.arc = function ( x, y, radius, startAngle, endAngle, side ) {
  this.tmpArray.push( { fn: 'arc', params: [ x, y, radius, startAngle, endAngle, side ] } );
}

/**
 * Canvas.stroke emulator, stores all primitives and resets temporary storage array
 *
 * @api public
 */

CanvasPrimitives.prototype.stroke = function () {
  for ( var n in this ) {
    if ( getAttr( n ) ) {
      this.array.push( { attr: n, value: this[ n ] } );
      delete this[ n ];
    }
  }

  for ( var i = 0; i < this.tmpArray.length; i++ ) {
    this.array.push( this.tmpArray[ i ] );
  }

  this.array.push( { fn: 'stroke' } );

  this.tmpArray = [];
}

/**
 * Enumerate stored primitives
 *
 * @param {function} callback Callback function
 * @return {array} Array with all callback's return values
 * @api public
 */

CanvasPrimitives.prototype.enum = function ( callback ) {

  var result = [];

  for ( var i = 0; i < this.array.length; i++ ) {
    if ( isFunction( callback ) ) {
      var r = callback( this.array[ i ], i );
      if ( null !== r ) {
        result.push( r );
      }
    }
  }

  return result;
}

/**
 * Paints stored primitives to target
 *
 * @param {element|string} target Target canvas element or target canvas element ID
 * @api public
 */

CanvasPrimitives.prototype.paint = function ( target ) {

  var ctx = getContext( target );
  if ( ctx ) {
    this.enum( function ( p ) { 
      if ( p.fn ) {
        ctx[ p.fn ].apply( ctx, p.params );
      }
      else {
        ctx[ p.attr ] = p.value;
      }
    } );
  }
}
