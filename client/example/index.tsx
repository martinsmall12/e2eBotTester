import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Homepage from '../src';

const App = () => {
    return (
        <div>
            <Homepage/>
        </div>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
