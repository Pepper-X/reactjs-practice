import React, { Component, PureComponent } from "react";
import ReactDOM from "react-dom";

class HelloWorld extends Component {
    render() {
        return (
            <h1>Hello World! [Component]</h1>
        );
    }
}

const HelloWorld2 = () => {
    return <h1>Hello World! [func style]</h1>
}

class HelloWorld3 extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        //do nothing by now
    }
    render() {
        return (
            <h1>Hello World! [Pure Component]</h1>
        );
    }
}

ReactDOM.render(<div><HelloWorld /> <HelloWorld2 /> <HelloWorld3 /></div>, document.getElementById("index"));
ReactDOM.render(React.createElement("h1", null, "Hello World! [createElement]"), document.getElementById("index2"));
