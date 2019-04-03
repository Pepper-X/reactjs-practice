import React, { Component, PureComponent } from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const SEARCH = "search", DETAILS = "details";
const TITLE = "title", GENRE = "genre";
const VOTE_AVERAGE = "vote_average", RELEASE_DATE = "release_date";

const MoviePoster = (props) => {
    return <div style={{backgroundSize: "contain", width: 200, height: 300, backgroundImage: `url(${props.imageUrl})`}} />
};

const ActionButton = (props) => {
    let style = {
        backgroundColor: props.bgColor? props.bgColor : 'red',
        color: props.color ? props.color : 'white'
    }
    return <button className={props.className} style={style} onClick={props.action} > {props.name} </button>
};

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
            self.setState({
                foundNumber : data.total,
                prevSearch : searchOps
            });
            self.props.storeMovies(movies);
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
            limit : "-1"
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
        let btnLine = {paddingBottom: 10};
        let redLine = {borderTop: '1px solid red'};
        return (
            <>
            <div className="container-fluid">
                <h5> FIND YOUR MOVIE </h5>
                <input type="search" value = {this.state.search} onChange = {this.updateSearch.bind(this)} style={searchFieldStyle}/>
            </div>
            <div className="container-fluid" >
                <div style={{...redLine,...btnLine}} />
                <div>
                    <span> SEARCH BY </span>
                    <ActionButton name={TITLE} bgColor={titleBgColor} action={this.switchSearchBy.bind(this)} className={'btn'} />
                    &nbsp;
                    <ActionButton name={GENRE} bgColor={genreBgColor} action={this.switchSearchBy.bind(this)} className={'btn'} />
                    
                    <div style={searchButtonStyle}>
                        <ActionButton name={'SEARCH'} action={this.doSearch.bind(this)} className="btn" />
                    </div>
                </div>
            </div>
            <div className="container-fluid d-table">
                <div style={btnLine}/>
                <div className="float-left">
                    <span>{this.state.foundNumber} movies found</span>
                </div>
                <div className="float-right">
                    <span>Sort by</span>
                    <ActionButton name={'release date'} bgColor={'white'} color={releaseDateColor} action={this.switchSortBy.bind(this)} />
                    <ActionButton name={'rating'} bgColor={'white'} color={ratingColor} action={this.switchSortBy.bind(this)} />
                </div>
            </div>
            </>
        );
    }
}

const Movie = (props) => {
    let movieBox = {cursor: "pointer"};
    let titleAndYear = {width: "100%", paddingTop: 5};
    let title = {width: 150, overflow: "hidden", whiteSpace: "nowrap"};
    let switchToDetails = function () {
        props.switchToDetails(props.data);
    };
    let genres = {fontSize: 8, width: 200, overflow: "hidden", whiteSpace: "nowrap"};
    let bottomSpace = {paddingTop: 5};
    return (
        <>
        <div style={movieBox} className="col-auto justify-content-around" onClick = {switchToDetails}>
            <MoviePoster imageUrl={props.data.poster_path} />
            <div style={titleAndYear} className="d-table">
                <span className="float-left" style={title}>{props.data.title}</span>
                <span className="float-right">{props.data.release_date.substr(0, 4)}</span>
            </div>
            <div style={genres}>
                {props.data.genres.map((genre) => 
                    <span>{genre}&nbsp;</span>
                )}
            </div>
            <div style={bottomSpace}/>
        </div>
        </>
    );
}

class SearchResult extends Component {
    render() {
        let space = {width: "100%", height: 15};
        let resultList = { display: "-webkit-flex", display: "flex", WebkitFlexDirection: "row", "flexDirection": "row"};
        return (
            <>
            <div style={space} />
            <div className="container-fluid">
                <div style={resultList} className="d-flex flex-row flex-wrap">
                    {this.props.movies.map((movie) => 
                        <Movie key={movie.id.toString()} data={movie} switchToDetails={this.props.switchToDetails}/>
                    )}
                </div>
            </div>
            </>
        );
    }
}



class TheApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page : SEARCH,
            movies: [],
            sameGenreMovies: [],
            movie: null
        }
    }
    switchToDetails(movie) {
        this.setState((state, props) => {
            return {
                page : DETAILS,
                movie: movie,
                sameGenreMovies: state.movies.filter(m => m.genres.some(g => movie.genres.includes(g)))
            }
        });
    }
    switchToSearch() {
        this.setState({page : SEARCH});
    }
    storeMovies(movies) {
        this.setState({movies: movies});
    }
    render() {
        let commonStyle = {
            width: 720,
            align: 'center'
        };
        if (this.state.page === SEARCH) {
            return (
                <div style={commonStyle}>
                    <MovieSearch storeMovies={this.storeMovies.bind(this)}/>
                    <SearchResult switchToDetails={this.switchToDetails.bind(this)} movies={this.state.movies} />
                </div>
            );
        } else {
            let movieDetails = {backgroundColor: "grey", minHeight: 300, paddingTop: 10, paddingBottom: 10};
            let movie = this.state.movie;
            let title = {width: 300, overflow: "hidden", whiteSpace: "nowrap", color: "red", fontSize: 20, fontWeight: "bold"};
            let ratingCircle = {border: "1px solid white", width: 30, height: 30, borderRadius: "50%", textAlign: "center", display: "inline-table"};
            let rating = {color: "white", display: "table-cell", verticalAlign: "middle", fontSize: 16};
            return (
                <div style={commonStyle}>
                    <div className="container-fluid d-table" style={movieDetails}>
                        <div className="container-fluid d-table">
                            <ActionButton action={this.switchToSearch.bind(this)} name="SEARCH" bgColor="white" className="btn float-right" color="red"/>
                        </div>
                        <div className="d-flex flex-row">
                            <div className="col-auto justify-content-around">
                                <MoviePoster imageUrl={movie.poster_path} />
                            </div>
                            <div className="justify-content-around">
                                <div className="d-flex flex-column">
                                    <div className="col-auto justify-content-around">
                                        <span style={title}>{movie.title}</span>
                                        <div style={ratingCircle}><span style={rating}>{movie.vote_average}</span></div>
                                    </div>
                                    <div className="col-auto justify-content-around" style={{fontSize: "bold"}}>
                                        {movie.release_date.substr(0, 4)}&nbsp;&nbsp;&nbsp;{movie.runtime}
                                    </div>
                                    <div className="col-auto justify-content-around">
                                        {movie.overview}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="col-auto justify-content-around">
                            Films by {movie.genres.map(genre => <span>{genre}&nbsp;</span>)} genre
                        </div>
                    </div>
                    <SearchResult switchToDetails={this.switchToDetails.bind(this)} movies={this.state.sameGenreMovies} />
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
