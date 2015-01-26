var React = require("react/addons");
var State = require("react-router").State;
var Link = require("react-router").Link;
var Rx = require("rx");
var jQuery = require("jquery");
var CSSTransitionGroup = React.addons.CSSTransitionGroup;

var PhoneItem = React.createClass({
  mixins: [State],

  getInitialState: function () {
    id = this.getParams().id;
    return {id: id};
  },

  componentDidMount: function() {
    var requestStream = Rx.Observable.returnValue('http://localhost:8000/phones/' + this.state.id + '.json');

    var responseStream = requestStream
    .flatMap(function(requestUrl) {
      return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
    });

    var data = [];
    responseStream.subscribe(function(response) {
      this.setState({phone: response, mainImageUrl: response.images[0]});
    }.bind(this));
  },

  render: function() {
    var phone = this.state.phone;
    if (!phone) {
      return (<div></div>);
    }

    var mainImage = (
        <img src={"http://localhost:8000/" + this.state.mainImageUrl} className="phone active"  key={this.state.mainImageUrl} />
    );

    var liImages = phone.images.map(function(img) {
      var setImage = this.setImage.bind(this, img);
      return <li key={img}><img src={"http://localhost:8000/" + img} onClick={setImage} /></li>
    }.bind(this));

    var availabilities = phone.availability.map(function(av) {
      return <dd key={av}>{av}</dd>
    });

    var checkmark = function (input) {
      return input ? '\u2713' : '\u2718';
    };

    var dimensions = phone.sizeAndWeight.dimensions.map(function(d) {
      return <dd key={d}>{d}</dd>
    });

    return (
      <div>
        <div className="phone-images">
          <CSSTransitionGroup transitionName="item">
            {mainImage}
          </CSSTransitionGroup>
        </div>
        <h2>{phone.name}</h2>
        <p>{phone.description}</p>
        <ul className="phone-thumbs">
          { liImages }
        </ul>

        <ul className="specs">
          <li>
            <span>Availability and Networks</span>
            <dl>
              <dt>Availability</dt>
              { availabilities }
            </dl>
          </li>
          <li>
            <span>Battery</span>
            <dl>
              <dt>Type</dt>
              <dd>{phone.battery.type}</dd>
              <dt>Talk Time</dt>
              <dd>{phone.battery.talkTime}</dd>
              <dt>Standby time (max)</dt>
              <dd>{phone.battery.standbyTime}</dd>
            </dl>
          </li>
          <li>
            <span>Storage and Memory</span>
            <dl>
              <dt>RAM</dt>
              <dd>{phone.storage.ram}</dd>
              <dt>Internal Storage</dt>
              <dd>{phone.storage.flash}</dd>
            </dl>
          </li>
          <li>
            <span>Connectivity</span>
            <dl>
              <dt>Network Support</dt>
              <dd>{phone.connectivity.cell}</dd>
              <dt>WiFi</dt>
              <dd>{phone.connectivity.wifi}</dd>
              <dt>Bluetooth</dt>
              <dd>{phone.connectivity.bluetooth}</dd>
              <dt>Infrared</dt>
              <dd>{checkmark(phone.connectivity.infrared)}</dd>
              <dt>GPS</dt>
              <dd>{checkmark(phone.connectivity.gps)}</dd>
            </dl>
          </li>
          <li>
            <span>Android</span>
            <dl>
              <dt>OS Version</dt>
              <dd>{phone.android.os}</dd>
              <dt>UI</dt>
              <dd>{phone.android.ui}</dd>
            </dl>
          </li>
          <li>
            <span>Size and Weight</span>
            <dl>
              <dt>Dimensions</dt>
              {dimensions}
              <dt>Weight</dt>
              <dd>{phone.sizeAndWeight.weight}</dd>
            </dl>
          </li>
          <li>
            <span>Display</span>
            <dl>
              <dt>Screen size</dt>
              <dd>{phone.display.screenSize}</dd>
              <dt>Screen resolution</dt>
              <dd>{phone.display.screenResolution}</dd>
              <dt>Touch screen</dt>
              <dd>{checkmark(phone.display.touchScreen)}</dd>
            </dl>
          </li>
          <li>
            <span>Hardware</span>
            <dl>
              <dt>CPU</dt>
              <dd>{phone.hardware.cpu}</dd>
              <dt>USB</dt>
              <dd>{phone.hardware.usb}</dd>
              <dt>Audio / headphone jack</dt>
              <dd>{phone.hardware.audioJack}</dd>
              <dt>FM Radio</dt>
              <dd>{checkmark(phone.hardware.fmRadio)}</dd>
              <dt>Accelerometer</dt>
              <dd>{checkmark(phone.hardware.accelerometer)}</dd>
            </dl>
          </li>
          <li>
            <span>Camera</span>
            <dl>
              <dt>Primary</dt>
              <dd>{phone.camera.primary}</dd>
              <dt>Features</dt>
              <dd>{phone.camera.features.join(', ')}</dd>
            </dl>
          </li>
          <li>
            <span>Additional Features</span>
            <dd>{phone.additionalFeatures}</dd>
          </li>
        </ul>
      </div>
    );
  },

  setImage: function(img) {
    this.setState({mainImageUrl: img});
  }
});

module.exports = PhoneItem;
