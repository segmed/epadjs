import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import "./ImageScrollbar.css";

class ImageScrollbar extends PureComponent {
  static propTypes = {
    value: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    height: PropTypes.string.isRequired,
    onInputCallback: PropTypes.func.isRequired
  };

  render() {
    if (this.props.max === 0) {
      return null;
    }

    this.style = {
      width: `${this.props.height}`
    };

    return (
      <div className="scroll">
        <div className="scroll-holder">
          <input
            className="imageSlider"
            style={this.style}
            type="range"
            min="0"
            max={this.props.max}
            step="1"
            value={this.props.value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
          />
        </div>
      </div>
    );
  }

  onChange = event => {
    const intValue = parseInt(event.target.value, 10);
    this.props.onInputCallback(intValue);
  };

  onKeyDown = event => {
    // We don't allow direct keyboard up/down input on the
    // image sliders since the natural direction is reversed (0 is at the top)

    // Store the KeyCodes in an object for readability
    const keys = {
      DOWN: 40,
      UP: 38
    };

    // TODO: Enable scroll down / scroll up without depending on ohif-core
    if (event.which === keys.DOWN) {
      //OHIF.commands.run('scrollDown');
      event.preventDefault();
    } else if (event.which === keys.UP) {
      //OHIF.commands.run('scrollUp');
      event.preventDefault();
    }
  };
}

export default ImageScrollbar;
