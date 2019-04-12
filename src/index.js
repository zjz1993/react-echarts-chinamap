import React, { Component } from 'react'
import classnames from 'classnames'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts'
import PropTypes from 'prop-types'

import styles from './styles.less'
const requestPrefix = 'https://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/children';

export default class ChinaMap extends Component {
  static propTypes = {
    onChange: PropTypes.func, // 点击地图区域时的回调函数
    extraOption: PropTypes.object,
    style: PropTypes.object,
    defaultSelectedAreaName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    echartsClassName: PropTypes.string,
    showCallbackBtn: PropTypes.bool,
    showTips: PropTypes.bool
  }
  static defaultProps = {
    defaultSelectedAreaName: '',
    onChange: () => {},
    extraOption: {},
    style: {},
    wrapperClassName: '',
    echartsClassName: '',
    showCallbackBtn: true,
    showTips: true
  }
  constructor(props) {
    super(props)
    this.state = {
      toastVisible: false,
      mapData: {},
      mapObject: {},
      clickItemName: [],
      clickId: '1',
      clickItemArray: []
    }
  }
  componentDidMount() {
    this.getData()
  }
  createMapOption = (data, clickMapId) => {
    const defaultMapObject = {
      series: [{
        type: 'map',
        map: clickMapId,
        layoutCenter: ['50%', '50%'],
        zoom: 1.2,
        data: data.features.map((item) => {
          return {
            selected: item.properties.name === this.props.defaultSelectedAreaName,
            name: item.properties.name,
            id: item.properties.id || item.properties.adcode,
            lastLevel: item.properties.childrenNum === 0
          }
        })
      }]
    };
    const mapObject = Object.assign(defaultMapObject, this.props.extraOption);
    echarts.registerMap(clickMapId, data);
    this.state.clickItemArray.push(mapObject);
    this.setState({mapData: data, clickId: clickMapId, mapObject});
  }
  getData = (id) => {
    // 没id，说明是初始化中国地图
    if (!id) {
      window.fetch(`${requestPrefix}/100000.json`).then((data) => {
        return data.text();
      }).then((res) => {
        const data = JSON.parse(res);
        this.createMapOption(data, 'china');
      });
    } else {
      window.fetch(`${requestPrefix}/${id}.json`).then((data) => {
        return data.text();
      }).then((res) => {
        const data = JSON.parse(res);
        this.createMapOption(data, id);
      });
    }
  };
  clickMap = (params) => {
    // lastLevel 为true 说明是最后一级了
    if (params && params.data) {
      const {data: {name, id, lastLevel}} = params;
      if (!lastLevel) {
        this.getData(id);
        const len = this.state.clickItemName.length;
        if (len < 2) {
          this.state.clickItemName.push(name);
        } else {
          this.state.clickItemName[1] = name;
        }
        this.props.onChange(this.state.clickItemName);
      } else {
        this.setState({toastVisible: true}, () => {
          setTimeout(() => {
            this.setState({toastVisible: false});
          }, 1000);
        });
      }
    }
  };
  goBack = () => {
    this.state.clickItemArray.pop();
    this.state.clickItemName.pop();
    const mapObject = this.state.clickItemArray[this.state.clickItemArray.length - 1];
    this.setState({mapObject});
    this.props.onChange(this.state.clickItemName);
  }
  render() {
    const {
      clickItemArray,
      toastVisible,
      mapObject
    } = this.state;
    const {
      style,
      wrapperClassName,
      echartsClassName,
      showCallbackBtn,
      showTips
    } = this.props;
    const echartsMapWrapperCls = classnames(styles.echartsMapWrapper, wrapperClassName);
    const echartsCls = classnames(styles.echartsWrapper, echartsClassName);
    const onEvents = {
      click: this.clickMap,
    };
    return (
      <div className={echartsMapWrapperCls} style={style}>
        <ReactEcharts className={echartsCls} onEvents={onEvents} option={this.state.mapObject} />
        {showTips && toastVisible ? <div className={styles.toast}>暂无下一级数据</div> : null}
        {showCallbackBtn && clickItemArray.length !== 1 ? (
          <div onClick={this.goBack} className={styles.goback}>返回</div>
        ) : null}
      </div>
    );
  }
}
