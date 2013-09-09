//
// Dependencies
//
var type = require( 'type-tool' );

//
// Exports
//
module.exports = CvTool.prototype;

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
  cv = ( type.isString( target ) ?
    cv = document.getElementById( target ) :
    target );

  // Get canvas context
  return ( cv && cv.getContext && cv.getContext( "2d" ) );
}

//
// CvTool constructor
//
function CvTool() {
}

//
// Gets an attribute name from a keyword
//
CvTool.prototype.getAttr = function ( n ) {
  return getAttr( n );
}

//
// Gets canvas context from one canvas element or its ID
//
CvTool.prototype.getContext = function ( e ) {
  return getContext( e );
}

//
// Gets canvas context from one canvas element or its ID
//
CvTool.prototype.getPrimitives = function () {
  return new CvPrimitives();
}

//
// CvPrimitives constructor
//
function CvPrimitives() {
  this.array = [];
  this.tmpArray = [];
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
// Paints primitives to target
//
CvPrimitives.prototype.paint = function ( target ) {
  var
    p, ctx;

  ctx = getContext( target );
  if ( ctx ) {
    for ( var i = 0; i < this.array.length; i++ ) {
      p = this.array[ i ];
      if ( p.fn ) {
        ctx[ p.fn ].apply( ctx, p.params );
      }
      else {
        ctx[ p.attr ] = p.value;
      }
    }
  }
}
