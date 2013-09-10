//
// Dependencies
//
var
  type = require( 'type-tool' );

//
// External references
//
var
  isString = type.isString;

//
// Exports
//
module.exports.getAttr = getAttr;
module.exports.getContext = getContext;
module.exports.getPrimitives = getPrimitives;

//
// Canvas attributes dictionary
//
var CANVAS_ATTR = {
  // Colors, Styles and Shadows
  fillStyle: "fillStyle",
  strokeStyle: "strokeStyle",
  shadowColor: "shadowColor",
  shadowBlur: "shadowBlur",
  shadowOffsetX: "shadowOffsetX",
  shadowOffsetY: "shadowOffsetY",

  // Line styles
  lineCap: "lineCap",
  lineJoin: "lineJoin",
  lineWidth: "lineWidth",
  miterLimit: "miterLimit",

  // Text
  font: "font",
  textAlign: "textAlign",
  textBaseline: "textBaseline"
};

//
// Gets an attribute name from a keyword
//
function getAttr( n ) {
  return CANVAS_ATTR[ n ];
}

//
// Gets canvas context from one canvas element or its ID
//
function getContext( target ) {
  var
    cv;

  // Get canvas element
  cv = ( isString( target ) ?
    cv = document.getElementById( target ) :
    target );

  // Get canvas context
  return ( cv && cv.getContext && cv.getContext( "2d" ) );
}

//
// Get a painting primitives storage object
//
function getPrimitives() {
  return new CvPrimitives();
}

//
// Primitives class constructor
//
function CvPrimitives() {
  this.array = [];
  this.tmpArray = [];
}

CvPrimitives.prototype.getContext = function () {
  return this;
}

CvPrimitives.prototype.beginPath = function () {
  this.tmpArray.push( { fn: "beginPath" } );
}

CvPrimitives.prototype.closePath = function () {
  this.tmpArray.push( { fn: "closePath" } );
}

CvPrimitives.prototype.moveTo = function ( x, y ) {
  this.tmpArray.push( { fn: "moveTo", params: [ x, y ] } );
}

CvPrimitives.prototype.lineTo = function ( x, y ) {
  this.tmpArray.push( { fn: "lineTo", params: [ x, y ] } );
}

CvPrimitives.prototype.fill = function () {
  this.tmpArray.push( { fn: "fill" } );
}

//
// Stores all primitives and resets temporary storage array
//
CvPrimitives.prototype.stroke = function () {
  for ( var n in this ) {
    if ( getAttr( n ) ) {
      this.array.push( { attr: n, value: this[ n ] } );
      delete this[ n ];
    }
  }

  for ( var i = 0; i < this.tmpArray.length; i++ ) {
    this.array.push( this.tmpArray[ i ] );
  }

  this.array.push( { fn: "stroke" } );

  this.tmpArray = [];
}

//
// Enum primitives
//
CvPrimitives.prototype.enum = function ( callback ) {
  var
    r,
    result = [];

  for ( var i = 0; i < this.array.length; i++ ) {
    if ( isFunction( callback ) ) {
      r = callback( this.array[ i ], i );
      if ( null !== r ) {
        result.push( r );
      }
    }
  }

  return result;
}

//
// Paints primitives to target
//
CvPrimitives.prototype.paint = function ( target ) {
  var
    p, ctx;

  ctx = getContext( target );
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
