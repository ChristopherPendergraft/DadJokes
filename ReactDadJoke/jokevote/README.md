This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

I used the React Router V4 to manage route changes. The http requests use axios. Dead simple and no need for Redux, I may have use that if this was part of a larger system, or if more state management was needed. For CSS I used Flex. 

React Router V4 is a rethink on React as a full stack solution. Middleware no longer requires an Express layer. Routes and proxies can all use it and its where the React framework is headed.

[Lifecycle]
The App component is created and then upon componentDidMount the first call to the API is made, Axios uses promises so when the response is returned it makes sure the joke is not in the collection and adds to jokeData as well as sets the currentJoke. There is a subcompoent called Joke and it only displays if the route matches the ID, once it loads you can vote. Once the vote is cast, the next call is made and the previous joke is updated to the vote value(data.upvote). Then the previous joke is loaded into the history array. A user continues to vote, if they open the voting history tray then they can select any joke by clcking on it and setting that to currentJoke, if the user updates the vote value, a new joke is loaded from the API and the collection displays that change.
[History]
The history uses CSS to give the user insite on the vote 
[RED= NOT FUNNY, GREEN=FUNNY]

