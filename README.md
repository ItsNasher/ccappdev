## S19 Group 7
### Guide (Setting up Locally)
 1. Find the file and run `npm install` for all necessary dependencies
 2. go to `config.js` and change connection to your mongodb connection.
 3. find src and run `node index.js` on cmd
 4. type `localhost:3000` on your browser.
 5. register and login to access CHAT features

### Overview
CHAT (community hub for active threads/tags) is a platform that houses discussions on any topic. The web application will present the user with a landing page containing an account system where users will be able to log in on their accounts and personalize it based on what they want other users to see. Users can create posts to talk about any topic, users can also make comments on other users’ posts. 

Since CHAT will be a general focused forum, meaning it will often get cluttered especially without a feature that can easily sort or filter through posts. One of the features of this website would be a “Post Tag” feature allowing easier identification of what a post is about and can allow users to filter posts based on the post tag, making it so that only posts with that tag will appear. This will help keep the forum more organized.

 
 ### To Do List
  ## Landing Page
  - Do the rest of the Body
  - (the syntax for the search bar is in the code, just commented out)
  # Guide
  1. Download File
  2. Find the location of package.json
  3. `npm install` to download dependencies
 
  ## Login Register
  - ~~Sessions (so that log out works, and the site remembers who is logged on)~~
 
  ## Main Forum
  - Add authentication (so that if you aren't logged in, you cant post or comment or go to profile).
 
  ## Create Post (including tag filters)
  - ~~Allow uploading of video links~~
  - ~~(make post button grey out when switching between tabs, make the content-box be required so theres an alert)~~
  - ~~tested out adding text/image/link to content and then switching to see if the upload will work. It works if its switching tabs to images or videos, but if its text it doesnt. Also example: title: aa text: aa --switch-->  image: randomimg.jpg (post created succsefully! posted the image in the db). Doesn't work if its image and video towards text tho.~~
  - ~~(difficult) store selected tags in db for future forum use~~
  - ~~Link the made posts in the db to the feed~~
  - ~~(optional) assign random color to each tag~~
  - add username as an attribute to the post
 
  ## Profile
  - Add object id as an attribute for users (so that we can see the posts that they have made).
  - add bio as an attribute for profile introduction.
  ## Comments
  - add username as an attribute to the comment
