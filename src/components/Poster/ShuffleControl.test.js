import React from 'react';
import ReactDOM from 'react-dom';
import {act, Simulate} from 'react-dom/test-utils';
import {ShuffleControl} from './ShuffleControl';

test('selects options directly and wraps sequential navigation', () => {
    const container=document.createElement('div');
    const onChange=jest.fn();
    const render=value=>act(()=>{ReactDOM.render(<ShuffleControl label="Image" value={value} options={[{value:'a',label:'A'},{value:'b',label:'B'},{value:'c',label:'C'}]} onChange={onChange}><button>Shuffle image</button></ShuffleControl>,container);});
    render('a');
    Simulate.click(container.querySelector('[aria-label="Previous image"]'));
    expect(onChange).toHaveBeenLastCalledWith('c');
    Simulate.click(container.querySelector('[aria-label="Next image"]'));
    expect(onChange).toHaveBeenLastCalledWith('b');
    render('c');
    Simulate.click(container.querySelector('[aria-label="Next image"]'));
    expect(onChange).toHaveBeenLastCalledWith('a');
    Simulate.change(container.querySelector('select'),{target:{value:'b'}});
    expect(onChange).toHaveBeenLastCalledWith('b');
    act(()=>{ReactDOM.unmountComponentAtNode(container);});
});
