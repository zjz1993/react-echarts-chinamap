import React, { Component } from 'react'
import './index.css';

import ChinaMap from 'react-echarts-chinamap'

export default class App extends Component {
  handle = (data) => {
    console.log(data);
  }
  render () {
    return (
      <div>
        <ChinaMap
          onChange={this.handle}
          wrapperClassName="test"
        />
      </div>
    )
  }
}
