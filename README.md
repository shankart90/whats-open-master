# What's Open interview project
Hey there! Thanks for interviewing with Restocks. Here's our React frontend interview project. We hope this will take around 4 hours, but please *don't spend more than 8 hours* on this project.

## Project background
This repo contains a [Next.js](https://github.com/zeit/next.js) React application. Currently, the app renders a Google Map of restaurants near Restocks.

We've included [react-google-maps](https://github.com/tomchentw/react-google-maps) which is a light wrapper over the [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/), and directly call the [Nearby Search API](https://developers.google.com/maps/documentation/javascript/places#place_search_requests) to fetch nearby restaurants.

## What we'd like you to do

We'd like you to add a couple of features to this map.

Specifically:

* a way to filter the data on the map to only show open restaurants
* ability to check if restaurants are open at a given time with time/date toggles (hint: [you might need to use this](https://developers.google.com/maps/documentation/javascript/places#place_details_requests))
* a third filter of your own. you can get pretty creative with the data that Google returns via the places API.

We've left this somewhat openended intentionally as we're excited to see what you come up with. Feel free to change the page as you'd like -- the map we've provided is just a starting point.


## Getting started

We really recommend reading the [Next.js](https://github.com/zeit/next.js#how-to-use) how to guide if this is your first React application.

To get started, clone this repo and do `npm install`.

You should be good to go after that.

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode. The Google Maps API key we've included only works on `http://localhost.restocksapp.com` (which resolves to localhost on your computer). We've made it the project default, but make sure you're on that domain if you're having issues getting the map to load.<br>
Open [http://localhost.restocksapp.com:3000](http://localhost.restocksapp.com:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any errors in the console.

### `npm run build`

Builds the app for production to the `.next` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run start`

Starts the application in production mode.
The application should be compiled with \`next build\` first.

## Using CSS

[`styled-jsx`](https://github.com/zeit/styled-jsx) is bundled with next to provide support for isolated scoped CSS. The aim is to support "shadow CSS" resembling of Web Components, which unfortunately [do not support server-rendering and are JS-only](https://github.com/w3c/webcomponents/issues/71).

```jsx
export default () => (
  <div>
    Hello world
    <p>scoped!</p>
    <style jsx>{`
      p {
        color: blue;
      }
      div {
        background: red;
      }
      @media (max-width: 600px) {
        div {
          background: blue;
        }
      }
    `}</style>
  </div>
)
```

Read more about [Next's CSS features](https://github.com/zeit/next.js#css).

## Adding Components

We recommend keeping React components in `./components` and they should look like:

### `./components/simple.js`

```jsx
const Simple = () => (
  <div>Simple Component</div>
)

export default Simple // don't forget to export default!
```

### `./components/complex.js`

```jsx
import { Component } from 'react'

class Complex extends Component {
  state = {
    text: 'World'
  }

  render () {
    const { text } = this.state
    return <div>Hello {text}</div>
  }
}

export default Complex // don't forget to export default!
```

## Fetching Data

You can fetch data in `pages` components using `getInitialProps` like this:

### `./pages/stars.js`

```jsx
const Page = (props) => <div>Next stars: {props.stars}</div>

Page.getInitialProps = async ({ req }) => {
  const res = await fetch('https://api.github.com/repos/zeit/next.js')
  const json = await res.json()
  const stars = json.stargazers_count
  return { stars }
}

export default Page
```

For the initial page load, `getInitialProps` will execute on the server only. `getInitialProps` will only be executed on the client when navigating to a different route via the `Link` component or using the routing APIs.

_Note: `getInitialProps` can **not** be used in children components. Only in `pages`._

Read more about [fetching data and the component lifecycle](https://github.com/zeit/next.js#fetching-data-and-component-lifecycle)
