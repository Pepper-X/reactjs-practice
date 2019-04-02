import React, { Component, PureComponent } from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const SEARCH = "search", DETAILS = "details";
const TITLE = "title", GENRE = "genre";
const VOTE_AVERAGE = "vote_average", RELEASE_DATE = "release_date";

const ActionButton = (props) => {
    let style = {
        backgroundColor: props.bgColor? props.bgColor : 'red',
        color: props.color ? props.color : 'white'
    }
    return <button className={props.className} style={style} onClick={props.action} > {props.name} </button>
}

class MovieSearch extends Component {
    constructor(props) {
        super(props)
        this.state ={
            searchBy: TITLE,
            sortBy: RELEASE_DATE,
            search: "",
            prevSearch: {},
            foundNumber: 0
        };
    }
    
    grabMovies(searchOps) {
        let url = new URL("http://reactjs-cdp.herokuapp.com/movies");
        Object.keys(searchOps).forEach(key => url.searchParams.append(key, searchOps[key]));
        let self = this;
        fetch(url, {method: 'GET'}).then(function(response) {
            return response.json();
        }).then(function(data) {
            let movies = data.data;
            movies.map(m => console.log(m));
            self.setState({
                foundNumber : data.total,
                prevSearch : searchOps
            });
        });
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
        this.grabMovies(searchOps);
    }
    
    switchSearchBy() {
        this.setState((state, props) => {
            return { searchBy : state.searchBy === TITLE ? GENRE : TITLE };
        });
    }
    
    switchSortBy() {
        var self = this;
        this.setState((state, props) => {
            return { sortBy : state.sortBy === VOTE_AVERAGE ? RELEASE_DATE : VOTE_AVERAGE };
        }, () => {
            if (this.state.foundNumber == 0) {
                return;
            }
            let searchOps = this.state.prevSearch;
            searchOps.sortBy = this.state.sortBy;
            this.grabMovies(searchOps);
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
        
        let releaseDateColor = this.state.sortBy === VOTE_AVERAGE ? 'grey' : 'red';
        let ratingColor = this.state.sortBy === VOTE_AVERAGE ? 'red' : 'grey';
        
        let searchButtonStyle = {float: 'right'};
        let searchFieldStyle = {width: '100%'};
        let left = {float: left};
        let right = {float: right};
        let redLine = {borderTop: '1px solid red', paddingTop: 10};
        return (
            <>
            <h5> FIND YOUR MOVIE </h5>
            <input type="search" value = {this.state.search} onChange = {this.updateSearch.bind(this)} style={searchFieldStyle}/>
            <div style={redLine}>
                <div>
                    <span> SEARCH BY </span>
                    <ActionButton name={TITLE} bgColor={titleBgColor} action={this.switchSearchBy.bind(this)} className={'btn'} />
                    &nbsp;
                    <ActionButton name={GENRE} bgColor={genreBgColor} action={this.switchSearchBy.bind(this)} className={'btn'} />
                    
                    <div style={searchButtonStyle}>
                        <ActionButton name={'SEARCH'} action={this.doSearch.bind(this)} className={'btn-lg'} />
                    </div>
                </div>
            </div>
            <div style={right}>
                <div style={left}>
                    <span>{this.state.foundNumber} movies found</span>
                </div>
                <span>Sort by</span>
                <ActionButton name={'release date'} bgColor={'white'} color={releaseDateColor} action={this.switchSortBy.bind(this)} />
                <ActionButton name={'rating'} bgColor={'white'} color={ratingColor} action={this.switchSortBy.bind(this)} />
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
