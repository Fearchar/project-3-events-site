# Happening

## Overview

Happening is an events site which allows users to browse events by category, view them as markers on a map, create and attend events, and view and follow other users and the events they are attending. I had a hand in several parts of the site, but my main contributions were to the events (or Happenings), on both the backend and frontend.

To visit the site, please click [here](https://happening-sei42.herokuapp.com/#/).

## The Project Brief

In groups of four, create a full stack website over a week, using React and a fully RESTful API created with Node.js and Express.

## Technologies Used
* JavaScript
* React
* Node.js
* Express
* MongoDB
* Mongoose
* SCSS
* Bulma

## Approaches & Features

I’m going to use Happenings as case study for the work I did on the site, picking out key element which are good examples of our approach or that I think may be interesting.

### Frontend

#### The Happenings Show Page

The HappeningShow classical component forms the page’s exoskeleton, structuring and wrapping around the functional components which create each of the individual elements seen on the page, and manages all of logical machinery which makes the page work, making server requests and managing which elements are shown on the page when.

```jsx
render() {
  console.log(this.state)
  const happening = this.state.happening
  const similarHappenings = this.state.similarHappenings
  if (!happening) return <h1 className="title">Loading ... </h1>
  return(
    <div className="section">
      <Hero
        deleteHappening={this.deleteHappening}
        attendHappening={this.attendHappening}
        unAttendHappening={this.unAttendHappening}
        {...{happening}}
      />
      <div className="container">

        <div className="columns is-variable is-4">

          <div className="column is-three-fifths">
            <MainBox {...happening} />
            <CommentsBox
              comments={happening.comments}
              commentsAreExpanded={this.state.commentsAreExpanded}
              commentFormIsOpen={this.state.commentFormIsOpen}
              errors={this.state.errors}
              toggleComments={this.toggleComments}
              toggleCommentForm={this.toggleCommentForm}
              storeCommentFormData={this.storeCommentFormData}
              submitComment={this.submitComment}
              deleteComment={this.deleteComment}
            />
          </div>

          <div className="column is-two-fifths container">
            <DetailsBox
              {...happening}
              time={happening.time}
            />
            <AttendeesBox attendees={happening.attendees} />
            {similarHappenings && <OtherHappeningsBox
              happenings={this.state.similarHappenings}
              linkToHappening={this.linkToHappening}
            />}
          </div>

        </div>

      </div>
    </div>
  )
```

Backend

Happening Models

The happening model consists of the main Happening schema, the comments schema, and a function to ensure that the postcode provided by the user is valid. Notable features of the model include the attendees and comments array fields which make it possible to attached and remove users and comments from events, and field validation messages created using the ‘required’ option.

Insert comments & happening schema

The code for the postcode validation runs before the normal model validation to ensure that only events with valid postcodes are saved. An axios request is made to the postcodes.io API, which returns a latitude and longitude for valid UK postcodes. Having the lattitude and longitude then allows us to place the event on a map on the frontend.

Insert prevalidation code

Routes and Controllers

Happening uses RESTful routes for creating, reading, updating and deleting (CRUD) Happenings, and has additional routes for creating and deleting comments. These are fed through to the relevant controllers which manage the API requests, return documents from the database and respond to the client, populating data from related records where necessary.

Insert comment delete route

Along with these six routes, two additional non-CRUD routes to allow users to attend and unattend events, associating and dissociating their user document with the Happening document.

Secure Routes

To ensure that some routes, for example those for creating and updating Happenings, could only be accessed by registered users, secure routes were created using middleware which to verify user credentials, using a token saved in the clients local storage.

Testing

Tests were used early in the project to ensure requests were returning what we expected. However, during the course of the project changes were made to models and controllers and, due to time constraints, we were unable to update the tests to match within the given time.

Future Features and Changes

Given more time on the project, I would change and add the following:

Fix / update server side tests
Make the other attendees box on the Happening show clickable, and bring up a modal showing all Happening attendees
Styled create and edit Happening pages which are in a similar shape and format to the Happening show
Improve responsive behaviour of the Home and About pages
