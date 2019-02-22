import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import ChinaMap from './'
const Simulate = TestUtils.Simulate;
const findDOMNode = TestUtils.scryRenderedDOMComponentsWithClass;

describe('ChinaMap', () => {
  beforeEach((done) => {
    const node = document.createElement('div');
    ReactDOM.render(
      <ChinaMap />, node
    )
  })
  it('works', () => {
    expect(ChinaMap).toBeTruthy()
  })
  it('add className', () => {
    const expectedClassName = '';
    expect(findDOMNode(ChinaMap, 'rc-collapse-item')).to.be(expectedClassName);
  });
})
