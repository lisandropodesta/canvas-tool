canvas-tool
===========

Canvas helper and primitives serializer

## Usage

### .getPrimitives()

Creates an object, with similar interface to canvas, that stores all primitives executed and allows to enumeration and painting.

```javascript
var cvTool = require( "canvas-tool" );
var pri_ctx = cvTool.getPrimitives();
pri_ctx.fillStyle = "white";
pri_ctx.strokeStyle = "blue";
pri_ctx.moveTo( 10, 20 );
pri_ctx.lineTo( 5, 10 );
pri_ctx.stroke();

pri_ctx.enum( function( p ) {
  // do something
} );

pri_ctx.paint( "canvas-element" );
```

### .getContext( value )

Gets the canvas context of one of this options:
 * Canvas element ID
 * Canvas element

```javascript
var cvTool = require( "canvas-tool" );
var ctx = cvTool.getContext( "canvas-element" );
ctx.moveTo( 10, 20 );
ctx.lineTo( 5, 10 );
ctx.stroke();
```

### .getAttr( value )

Checks if value is a valid canvas attribute and returns the attribute name. Future use includes translations as a dictionary.

```javascript
var cvTool = require( "canvas-tool" );
if ( cvTool.getAttr( "fillStyle" ) ) {
  // fillStyle is a valid canvas attribute
}
```
