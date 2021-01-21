import React, {Component} from 'react';
import Header from './components/Header';
import Banner from './components/Banner';

class App extends Component {

    constructor(props) {
        super(props);

        const meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
        document.getElementsByTagName('head')[0].appendChild(meta);
    }

    render() {
        return (
            <div>
                <Header/>
                {this.props.children}
                <Banner/>
            </div>
        );
    }
}

export default App;
