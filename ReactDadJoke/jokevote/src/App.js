import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import Joke from './components/Joke';
import { Link, Route, withRouter, Be } from 'react-router-dom';
import logo from './bob.png';
import './App.css';

/* Home component */


/* Category component */
const Category = () => (
    <div>
        <h2>Category</h2>
    </div>
)

const Home = () => (
    <div>
        <h2>History</h2>
    </div>
)



/* App component */
class App extends React.Component {
    constructor () {
        super();
        this.state = {
            currentJoke: {},
            history: [],
            jokeData: [],
            showHistory:false
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged(this.props.location);
        }
    }

    onRouteChanged(loc) {

        let id = loc.pathname.split('/')[2];
        console.log("ROUTE CHANGED", id);

        let current = this.state.jokeData.filter(joke => {
            return joke.id ===  id;
        })
        this.setState({currentJoke: current[0]});

    }
    componentDidMount(){
        let {history}  = this.props;

        axios.get('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } })
            .then(response => {
                var newObject = response.data;
                newObject.upvote = false;

                this.setState({jokeData: [newObject] }), setTimeout(this.updateState(newObject.id), 1000) });


    }
    loadNewJoke(upvote){
        let {currentJoke}  = this.state;

        console.log('upvote', currentJoke.id);
        let joker = this.state.jokeData.filter(joke => {
            return joke.id === currentJoke.id;
        })
        joker[0].upvote = upvote;
        console.log('upvote', joker);

        axios.get('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } })
            .then(response => {
                var newObject = response.data;
                newObject.upvote = false;
                var newArr = this.state.jokeData;
                if(newArr.indexOf(newObject)=== -1){
                    newArr.push(newObject);
                }

                this.setState({jokeData:newArr}) ;
                setTimeout(this.updateState(newObject.id), 1000);
            });

    }
    toggleHistory(){
        console.log('showHistory');
        let {showHistory} = this.state;

        if(showHistory){
            this.setState({showHistory:false})
        }else{
            this.setState({showHistory:true})
        }
    }
    updateState(id){
        let {history}  = this.props;

        let current = this.state.jokeData.filter(joke => {
            return joke.id === id;
        })
        this.setState({currentJoke: current[0]});
        history.push( '/jokes/'+id);
    }
    render() {
        console.log('newarray', this.state.jokeData);
        const { showHistory } = this.state;





        const Jokes = ({ match }) => {
            const {currentJoke, jokeData} = this.state;





            if(jokeData.length>0){

                let linkList = jokeData.map( (joke) => {
                    let  funny =  joke.upvote ? "FUNNY":"NOT FUNNY";
                    return(
                        <div className={joke.upvote? 'item_up':'item_down'}  key={joke.id} >
                            <Link className="itemLink" to={`${match.url}/${joke.id}`}>
                                {joke.joke}
                            </Link>
                        </div>
                    )

                })

                return(
                    <div>


                        <Route path={`${match.url}/:jokeId`}
                               render={ (props) =><div className="joke_holder"> <Joke data= {jokeData} {...props} /></div>}/>

                        <Route path={`${match.url}/:jokeId`}
                               render={ (props) =>   <div  className="btn__holder"  >
                        <div className="btn__up" onClick={()=> this.loadNewJoke(true)} >FUNNY</div>
                        <div className="btn__down" onClick={()=> this.loadNewJoke(false)} >NOT FUNNY</div>
                        </div>}/>
                        <hr />
                        <div onClick={ ()=> this.toggleHistory() } >   <h3 > <a href onClick={ ()=> this.toggleHistory()  }> {showHistory===true ? 'Hide Voting History':'Show Voting History'}</a></h3>  </div>
                        <div className={showHistory===true ? 'show_history':'hide_history'} >
                            {linkList}
                        </div>

                    </div>
                )
            }else{
                return null;
            }
        }




        return (

        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <h1 className="App-title">Welcome to Dad Joke Generator</h1>

            </header>
            <Route exact path="/" component={Jokes}/>
            <Route path="/jokes" component={Jokes}/>


        </div>

        )
    }
}
App.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }),
};
export default withRouter(App);
