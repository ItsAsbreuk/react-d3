'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../utils').shade;
var VoronoiArea = require('./VoronoiArea');

module.exports = React.createClass({

  displayName: 'VoronoiStar',

  getDefaultProps() {
    return { 
      markerOuterRadius: 6,
      markerInnerRadius: 3,
      arms: 5,
      markerFill: '#1f77b4',
      hoverAnimation: true
    };
  },

  getInitialState() {
    return {
      markerOuterRadius: this.props.markerOuterRadius,
      markerInnerRadius: this.props.markerInnerRadius,
      markerFill: this.props.markerFill
    }
  },

  render() {
    // animation controller
    var handleMouseOver, handleMouseLeave;
    if(this.props.hoverAnimation) {
      handleMouseOver = this._animateMarker;
      handleMouseLeave = this._restoreMarker;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }

    return (
      <g>
        <VoronoiArea
          handleMouseOver={handleMouseOver}
          handleMouseLeave={handleMouseLeave}
          voronoiPath={this.props.voronoiPath}
        />
        <path
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          fill={this.state.markerFill}
          d={this._calculateStarPoints(this.props.cx, this.props.cy, this.props.arms, this.state.markerOuterRadius, this.state.markerInnerRadius)}
          className="rd3-linechart-star"
        />
      </g>
    );
  },

  // Calculate path of star
  // from https://dillieodigital.wordpress.com/2013/01/16/quick-tip-how-to-draw-a-star-with-svg-and-javascript/
  _calculateStarPoints(centerX, centerY, arms, markerOuterRadius, markerInnerRadius) {
    var results = "";
    var angle = Math.PI / arms;

    for (var i = 0; i < 2 * arms; i++) {
      // Use outer or inner radius depending on what iteration we are in.
      var r = (i & 1) == 0 ? markerOuterRadius : markerInnerRadius;

      var currX = centerX + Math.cos(i * angle) * r;
      var currY = centerY + Math.sin(i * angle) * r;

      // Our first time we simply append the coordinates, subsequet times
      // we append a ", " to distinguish each coordinate pair.
      if (i == 0) {
        results = "M" + currX + " " + currY;
      }
      else {
        results += " L" + currX + " " + currY;
      }
    }
    results += " Z";
    return results;
  },

  _animateMarker() {
    this.setState({
      markerOuterRadius: this.props.markerOuterRadius * ( 5 / 4 ),
      markerInnerRadius: this.props.markerInnerRadius * ( 5 / 4 ),
      markerFill: shade(this.props.markerFill, 0.2)
    });
  },

  _restoreMarker() {
    this.setState(
        this.getInitialState()
    );
  }
});