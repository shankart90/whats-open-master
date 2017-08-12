import { Component } from 'react';
import { Marker, InfoWindow } from 'react-google-maps';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false,
    };
  }

  onClick() {
    this.setState({ showTooltip: !this.state.showTooltip });
  }

  render() {
    const { content, position, defaultAnimation } = this.props;
    return (
      <Marker
        position={position}
        defaultAnimation={defaultAnimation}
        onClick={this.onClick.bind(this)}
      >
        {this.state.showTooltip &&
          <InfoWindow onCloseClick={this.onClick.bind(this)}>
            <div>
              {content}
            </div>
          </InfoWindow>}
      </Marker>
    );
  }
}
