import React, {Component} from 'react';
import './styles/app.scss';

import Admin from '../modules/admin';

require('style!material-design-lite/dist/material.min.css');
require('style!material-design-icons/iconfont/material-icons.css');

class App extends Component {
    render() {
        return (
            <div className="app-content mdl-color--blue-grey-50">
                <Admin/>
            </div>
        )
    }
}

export default App;
