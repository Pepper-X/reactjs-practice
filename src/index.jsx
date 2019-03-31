import React, { Component, PureComponent } from "react";
import ReactDOM from "react-dom";

const SEARCH = "search", DETAILS = "details";
const TITLE = "title", GENRE = "genre";
const VOTE_AVERAGE = "vote_average", RELEASE_DATE = "release_date";

const ActionButton = (props) => {
    let style = {
        backgroundColor: props.bgColor? props.bgColor : 'red',
        color: props.color ? props.color : 'white'
    }
    return <button style={style} onClick={props.action} > {props.name} </button>
}

class MovieSearch extends Component {
    constructor(props) {
        super(props)
        this.state ={
            searchBy: TITLE,
            sortBy: RELEASE_DATE,
            search: ""
        };
    }
    doSearch() {
        if (this.state.search == "") {
            return null;
        }
        let searchOps = {
            sortBy : this.state.sortBy,
            sortOrder : "desc",
            searchBy : this.state.searchBy,
            search : this.state.search,
            limit : 10
        };
        let url = new URL("http://reactjs-cdp.herokuapp.com/movies");
        Object.keys(searchOps).forEach(key => url.searchParams.append(key, searchOps[key]));
        fetch(url, {method: 'GET'}).then(function(response) {
            return response.json();
        }).then(function(data) {
            let movies = data.data;
            movies.map(m => console.log(m));
        });
    }
    switchSearchBy() {
        this.setState((state, props) => {
            return { searchBy : state.searchBy === TITLE ? GENRE : TITLE };
        });
    }
    updateSearch(event) {
        this.setState({
            search : event.target.value
        });
    }
    render() {
        let titleBgColor = this.state.searchBy === TITLE ? 'red' : 'grey';
        let genreBgColor = this.state.searchBy === TITLE ? 'grey' : 'red';
        
        let searchButtonStyle = {float: 'right'};
        let searchFieldStyle = {width: '100%'};
        return (
            <>
            <h1> FIND YOUR MOVIE </h1>
            <input type="search" value = {this.state.search} onChange = {this.updateSearch.bind(this)} style={searchFieldStyle}/>
            <div>
                <span> SEARCH BY </span>
                <ActionButton name={TITLE} bgColor={titleBgColor} action={this.switchSearchBy.bind(this)} />
                <ActionButton name={GENRE} bgColor={genreBgColor} action={this.switchSearchBy.bind(this)} />
                
                <div style={searchButtonStyle}>
                    <ActionButton name={'SEARCH'} action={this.doSearch.bind(this)} />
                </div>
            </div>
            </>
        );
    }
}

class SearchResult extends Component {
    
    render() {
        return (
            <>
            <h1> here will be a list of movies </h1>
            <button onClick = {this.props.switchToDetails}>Go to details!</button>
            </>
        );
    }
}

const Moview = () => {
    return <h1>Hello World! [func style]</h1>
}

class TheApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page : SEARCH
        }
    }
    switchToDetails() {
        this.setState({page : DETAILS});
    }
    switchToSearch() {
        this.setState({page : SEARCH});
    }
    render() {
        let commonStyle = {
            width: 600,
            align: 'center'
        };
        if (this.state.page === SEARCH) {
            return (
                <div style={commonStyle}>
                <MovieSearch/>
                <SearchResult switchToDetails={this.switchToDetails.bind(this)}/>
                </div>
            );
        } else {
            return (
                <div style={commonStyle}>
                <button onClick = {this.switchToSearch.bind(this)}>Back to search</button>
                <h1>Hello World! [Component]</h1>
                </div>
            );
        }
    }
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.log("error " + error);
        console.log("info " + info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children; 
    }
}

ReactDOM.render(<ErrorBoundary><TheApp /> </ErrorBoundary>, document.getElementById("index"));
