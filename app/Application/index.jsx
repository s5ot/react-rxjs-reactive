var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

require("./style.css");

var Application = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
  },

  render: function() {
    return (
      <div>
          <h1>React+RxJS</h1>
        <RouteHandler />
      </div>)
  },
});

module.exports = Application;
