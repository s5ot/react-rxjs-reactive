var React = require("react/addons");
var Link = require("react-router").Link;
var Rx = require("rx");
var jQuery = require("jquery");
var CSSTransitionGroup = React.addons.CSSTransitionGroup;

var PhoneItem = React.createClass({
  render: function() {
    return (
      <li className="thumbnail" key={this.props.id}>
        <Link to='phoneitem' params={this.props}><img className='thumb' src={'http://localhost:8000/' + this.props.imageUrl}/></Link>
        <Link to='phoneitem' params={this.props}>{this.props.name}</Link>
        <p>{this.props.snippet}</p>
      </li>
    );
  }
});

var PhoneList = React.createClass({
  render: function() {
    var phoneNodes = this.props.data.map(function (phone) {
      return (
        <PhoneItem name={phone.name} snippet={phone.snippet} imageUrl={phone.imageUrl} id={phone.id} key={phone.name}/>
      );
    });

    return (
      <ul className="phones">
        <CSSTransitionGroup transitionName="collection">
          {phoneNodes}
        </CSSTransitionGroup>
      </ul>
    );
  }
});

var Home = React.createClass({
  mixins: [],

  getInitialState: function() {
    return {
      data: [],
      orderProp: 'age'
    };
  },

  componentDidMount: function() {
    var requestStream = Rx.Observable.returnValue('http://localhost:8000/phones/phones.json');

    var responseStream = requestStream
        .flatMap(function(requestUrl) {
          return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
        });

    var search = this.refs.search.getDOMNode();
    var keyupStream = Rx.Observable.fromEvent(search,  'keyup')
      .map(function (e) {
        return e.target.value;
      })
      .throttle(500)
      .distinctUntilChanged()
      .startWith('');

    var order = this.refs.order.getDOMNode();
    var orderStream = Rx.Observable.fromEvent(order, 'change')
        .map(function (e) {
            return e.target.value;
          }
        )
        .startWith('age');

    orderStream.subscribe(
      function(x) {
        this.setState({orderProp: x});
      }.bind(this),
      function(err) {
        console.log('error');
      },
      function() {
        console.log('completed');
      }
    );

    var filteredStream = responseStream
        .combineLatest(keyupStream, orderStream,
          function(data, k, o) {
            var matcher = new RegExp(".*" + k + ".*", 'i');
            return data.filter(function(phone) { return phone.name.match(matcher) || phone.snippet.match(matcher) })
                    .sort(function(a, b) {
                      if (String(a[o]).toLowerCase() > String(b[o]).toLowerCase()) {
                        return 1;
                      }
                      if (String(a[o]).toLowerCase() < String(b[o]).toLowerCase()) {
                        return -1;
                      }
                      return 0;
                    });
          }
        );

    filteredStream.subscribe(
      function(x) {
        this.setState({data: x});
      }.bind(this),
      function(err) {
        console.log('error');
      },
      function() {
        console.log('completed');
      }
    );
  },

  render: function() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              Search: <input type="text" ref="search" />
              Sort by:
              <select ref="order" value={this.state.orderProp}>
                <option value="name">Alphabetical</option>
                <option value="age">Newest</option>
              </select>
            </div>
            <div className="col-md-10">
              <PhoneList data={this.state.data} />
            </div>
          </div>
        </div>
      </div>
    )
  },
});

module.exports = Home;
