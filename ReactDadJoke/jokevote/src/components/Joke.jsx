/**
 * Created by ChrisPendergraft on 5/14/18.
 */
import React, { Component } from 'react';

const Joke = ({match,data}) => {
    let joke = data.find(p => p.id == match.params.jokeId);
    let jokeData;

    if(joke){
        jokeData = (
            <div>
                <h2> {joke.joke} </h2>
            </div>
            );

  }else{
        jokeData = <h2> Sorry. Joke not found </h2>
        };

    return (
        <div className="joke-card">
            <div>
                {jokeData}
            </div>
        </div>
    )
}
export default Joke;