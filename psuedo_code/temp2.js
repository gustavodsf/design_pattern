//#region import do react, antd, dva e umi
import React, { PureComponent } from 'react';
import Dimensions from 'react-dimensions';
import PropTypes from 'prop-types';
import MapGL, {
  Source,
  Layer,
  ScaleControl,
  NavigationControl,
  FullscreenControl,
  // GeolocateControl,
  FlyToInterpolator,
} from 'react-map-gl';
import { Drawer, Button, Tooltip } from 'antd';
import { formatMessage } from 'umi';

import { BlockOutlined, BgColorsOutlined, GatewayOutlined } from '@ant-design/icons';
//#endregion

//#region import components locais
import MapStyle from '@/components/Map/components/MapStyle';
import MapWms from '@/components/Map/components/MapWms';
import ControlPanel from '@/components/Map/components/ControlPanel';
//#endregion

const TOKEN =
  'pk.eyJ1IjoiYnJ1bm9nb25uY2FsdmVzIiwiYSI6ImNqa3R3cGU1MzAwc2kzcHFrcGRlYmc0NXAifQ.LoA3kbY8I5BEbqr9kOGyWA';

const controlPanelStyle = {
  position: 'absolute',
  top: 20,
  right: 20,
  padding: '10px',
};

const configsStyle = {
  display: 'flex',
  position: 'absolute',
  marginLeft: '40px',
  padding: '10px',
  zIndex: '2',
};

const geolocateStyle = {
  position: 'absolute',
  top: 20,
  left: 0,
  padding: '10px',
};

const fullscreenControlStyle = {
  position: 'absolute',
  top: 36,
  left: 0,
  padding: '10px',
};

const navStyle = {
  position: 'absolute',
  top: 72,
  left: 0,
  padding: '10px',
};

const scaleControlStyle = {
  position: 'absolute',
  bottom: 36,
  left: 0,
  padding: '10px',
};

class Map extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: props.lat,
        longitude: props.lng,
        zoom: props.zoom || 15,
        bearing: 0,
        pitch: 0,
        json: null,
      },
      visible: false,
      visibleWms: false,
      valueMapStyle: 'dark-v10',
    };
    this.map = React.createRef();
  }

  onStyleLoad = (map, e) => {
    //console.log(map);
  };

  _onClickMap(evt) {
    // console.log(evt.lngLat);
  }

  componentWillReceiveProps(nextProps) {
    const { lat, lng } = this.props;
    if (nextProps.lat !== lat || nextProps.lng !== lng) {
      this.updateLatLng(nextProps.lat, nextProps.lng);
    }
  }

  updateLatLng = (lat, lng) => {
    const { viewport } = this.state;

    const newData = viewport;
    newData.latitude = lat;
    newData.longitude = lng;

    this.setState({ viewport });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onCloseDrawer = () => {
    this.setState({
      visible: false,
    });
  };

  showDrawerWms = () => {
    this.setState({
      visibleWms: true,
    });
  };

  onCloseDrawerWms = () => {
    this.setState({
      visibleWms: false,
    });
  };

  onChangeValueMapStyle = val => {
    this.setState({ valueMapStyle: val.target.value });
  };

  _onViewportChange = viewport =>
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });

  _goToViewport = ({ longitude, latitude }) => {
    this._onViewportChange({
      longitude,
      latitude,
      zoom: 20,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
      transitionDuration: 'auto',
    });
  };

  updateLayer = layer => {
    this.setState({
      json: layer,
    });
  };

  renderLayers = () => {
    if (this.state.json) {
      return (
        <Source id="my-data" type="geojson" data={this.state.json}>
          <Layer
            id="point"
            type="line"
            paint={{
              'line-color': '#fa0202',
            }}
          />
        </Source>
      );
    }
  };
  // item para montar o redirecionamento para um equipamento ou destino e origem
  // <div style={controlPanelStyle} >
  //    <ControlPanel
  //      containerComponent={this.props.containerComponent}
  //      onViewportChange={this._goToViewport}
  //    />
  // </div>

  // item para pegar a localizar do usuario atualmente.
  // <div style={geolocateStyle}>
  //    <GeolocateControl/>
  //  </div>

  //<Tooltip title="Polygon">
  //<Button shape="circle" icon={<GatewayOutlined />} onClick={this.showDrawer} />
  //</Tooltip>

  render() {
    const { containerWidth, containerHeight, children } = this.props;
    const { visible } = this.state;
    const { visibleWms } = this.state;
    const { valueMapStyle } = this.state;

    return (
      <>
        <MapGL
          ref={this.map}
          width={containerWidth}
          height={containerHeight}
          {...this.state.viewport}
          mapStyle={`mapbox://styles/mapbox/${valueMapStyle ||  }`}
          mapboxApiAccessToken={TOKEN}
          onViewportChange={this._onViewportChange}
          attributionControl={true}
          onClick={this._onClickMap}
          onStyleLoad={this.onStyleLoad}
        >
          {children}

          <div style={fullscreenControlStyle}>
            <FullscreenControl />
          </div>
          <div style={navStyle}>
            <NavigationControl />
          </div>
          <div style={scaleControlStyle}>
            <ScaleControl />
          </div>
          <div style={configsStyle}>
            <Tooltip title="Map Style">
              <Button shape="circle" icon={<BgColorsOutlined />} onClick={this.showDrawer} />
            </Tooltip>
            <Tooltip title="Wms">
              <Button shape="circle" icon={<BlockOutlined />} onClick={this.showDrawerWms} />
            </Tooltip>

            <Drawer
              placement="right"
              closable={false}
              onClose={this.onCloseDrawer}
              visible={visible}
            >
              <MapStyle
                valueMapStyle={valueMapStyle}
                onChangeValue={this.onChangeValueMapStyle}
                onSetLayer={layer => this.updateLayer(layer)}
              />
            </Drawer>

            <Drawer
              placement="right"
              closable={false}
              onClose={this.onCloseDrawerWms}
              visible={visibleWms}
            >
              <MapWms
                valueMapStyle={valueMapStyle}
                onChangeValue={this.onChangeValueMapStyle}
                onSetLayer={layer => this.updateLayer(layer)}
              />
            </Drawer>
          </div>
          {this.renderLayers()}
        </MapGL>
      </>
    );
  }
}

const DimensionedMap = Dimensions()(Map);

export default DimensionedMap;
