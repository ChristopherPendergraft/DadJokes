This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

I used the React Router V4 to manage route changes. The http requests use axios. Dead simple and no need for Redux, I may have use that if this was part of a larger system, or if more state management was needed. For CSS I used Flex. 

## Lifecycle Overview
The App component is created and then upon componentDidMount the first call to the API is made, The components are conditional based on data, so using match we do or dont display until data is ready. Upon voting susequent calls are made to the API. 

## React Router V4
React Router  V4 is a rethink on React as a full stack solution. Middleware no longer requires an Express layer. Routes and proxies can all use it and its where the React framework is headed.



## Axios HTTP Requests
Axios uses promises so when the response is returned it makes sure the joke is not in the collection and adds to jokeData as well as sets the currentJoke. There is a subcompoent called Joke and it only displays if the route matches the ID, once it loads you can vote. Once the vote is cast, the next call is made, as is a check, because the API uses RNG to call from what seems a limited set of jokes,  and the previous joke is updated to the vote value(data.upvote), and then it is loaded into the history array. 

## HISTORY
A user can continues to vote unless the DB is Exuasted,  but if they open the voting history tray then they can select any joke by clcking on it and setting that to currentJoke, if the user updates the vote value, a new joke is loaded from the API and the collection displays that change.The history uses CSS to give the user insite on the vote 

## RED= NOT FUNNY, GREEN=FUNNY

## TTD - or things I would enhance 
if given more time, I was told 12 hours, I would have avoided axios and create React Router V4 endpoints to handle the CORS issues that we may face if deploying to public. I imagine that this API is wildcard to allow anyrequest but its still cross domain issue prone. This was just down and dirty simple dimple. Also better CSS, I guess. Maybe a voting percentage of terrible jokes display in the history tray. The spec was limited and I stuck to it. Also the browser history works, but since this is all in the browsers memory this solution would not support direct URLS, unless we took the inbound path, stripped the iD, made a CALL to the API and started the list over. Unless we work with cookies, localStore would be lost on refresh. I imagine a long voting app would store and post to the serivce layer once a section was complete. Again did not want to go off the reservation, just stick to the request. 

## TO RUN
Checkout the project and run 
 
`npm install`

after dependecies are installed run 

`npm start`

that will spin up a local instace you can access at http://localhost:3000/
it will pop up a browser but it takes a good few seconds to get the page going. This is also a dev server with a watcher that will contiunue to recompile the app as changes are made. 


