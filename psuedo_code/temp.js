import React, { useCallback, useRef, useState, version } from 'react';
import { Button, Drawer, Form, Tooltip, Input } from 'antd';
import { DeleteOutlined, BorderOutlined } from '@ant-design/icons';
import { DrawPolygonMode, Editor, EditingMode, RENDER_STATE } from 'react-map-gl-draw';
import { SketchPicker } from 'react-color';
import { formatMessage } from 'umi';

import { getFeatureStyle, getEditHandleStyle } from './style';

const configsStyle = {
    display: 'flex',
    position: 'absolute',
    marginLeft: '40px',
    padding: '10px',
    zIndex: '2',
    marginTop: '35px',
  };

export default function Polygon(props) {
    const { lngLat } = props;
    const [form] = Form.useForm();
    const [color, setColor] = useState('rgb(60, 178, 208)')

    const [mode, setMode] = useState(null);
    const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const editorRef = useRef(null);

    const ondDrawPolygon = () => {
        setMode(new DrawPolygonMode());
        setShowInfo(true);
    };

    const onSelect = useCallback(options => {
      setSelectedFeatureIndex(options && options.selectedFeatureIndex);
    }, []);

    const onDelete = useCallback(() => {
      if (selectedFeatureIndex !== null && selectedFeatureIndex >= 0) {
        editorRef.current.deleteFeatures(selectedFeatureIndex);
      }
    }, [selectedFeatureIndex]);

    const onUpdate = useCallback(({ editType }) => {
      if (editType === 'addFeature') {
        setMode(new EditingMode());
        setShowInfo(true);
      }
    }, []);

    const closeInfo = () => {
        setShowInfo(false);
    }

    const getFeatureStyle = ({feature, index, state }) => {
        switch (state) {
          case RENDER_STATE.SELECTED:
          case RENDER_STATE.HOVERED:
          case RENDER_STATE.UNCOMMITTED:
          case RENDER_STATE.CLOSING:
            return {
              stroke: 'rgb(251, 176, 59)',
              strokeWidth: 2,
              fill: 'rgb(251, 176, 59)',
              fillOpacity: 0.3,
              strokeDasharray: '4,2',
            };

          default:
            return {
              stroke: color,
              strokeWidth: 2,
              fill: color,
              fillOpacity: 0.1,
            };
        }
    }

    return (
        <>
            <div style={configsStyle}>
                <Tooltip title="Draw Polygon">
                    <Button shape="circle" icon={<BorderOutlined />} onClick={ondDrawPolygon} />
                </Tooltip>
                <Tooltip title="Delete Polygon">
                    <Button shape="circle" icon={<DeleteOutlined />} onClick={onDelete} />
                </Tooltip>
            </div>
            <Editor
                ref={editorRef}
                style={{ width: '100%', height: '100%' }}
                clickRadius={12}
                mode={mode}
                onSelect={onSelect}
                onUpdate={onUpdate}
                editHandleShape="circle"
                featureStyle={getFeatureStyle}
                editHandleStyle={getEditHandleStyle}
            />
            <Drawer
              placement="right"
              closable
              onClose={closeInfo}
              visible={showInfo}
              mask={false}
            >
                <Form layout="vertical" form={form} name="ModalCreatePolygon">
                    <h4>Criar Polígono</h4>
                    <span>latitude: </span>  {lngLat[1]} <br />
                    <span>longitude: </span> {lngLat[0]}
                </Form>
            </Drawer>
        </>
    );
}
