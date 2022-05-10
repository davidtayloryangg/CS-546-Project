# CS-546-Project Park Activity Meet-Up

## Introduction

Park Activity Meet-Up is a Hoboken specific application to connect users to build relationships and use everything hoboken parks have to offer...

## Installation

Before following the installation instructions below, your system will need node.js.

1. `npm install` - installs all the package dependencies
2. `npm run seed` - seed database
3. `npm test` - run the tests (optional)
4. `npm start` - run the application

## Task: Select your task and add your name

1. Database: Yue Qin
   - User: Wenjing Zhou :white_check_mark:
   - Activitiy: Yutong Wei :white_check_mark:
   - Appointment: Yuheng Xiao :white_check_mark:
   - Comment: Yue Qin :white_check_mark:
   - Review: Yue Qin :white_check_mark:
   - Park: David Yang :white_check_mark:
2. Route:

   - Home:
     - ('/home').get Wenjing Zhou :white_check_mark:
   - Login:
     - ('/login').post Wenjing Zhou :white_check_mark:
   - Logout:
     - ('/logout').get Wenjing Zhou :white_check_mark:
   - Signup:
     - ('/signup').get Wenjing Zhou :white_check_mark:
     - ('/signup').post Wenjing Zhou :white_check_mark:
   - Parks:
     - ('/parks').get David Yang :white_check_mark:
     - ('/parks/id/:id').get David Yang :white_check_mark:
     - ('/parks/search').get Yutong Wei :white_check_mark:
     - ('/parks/allParks').get Yutong Wei :white_check_mark:
     - ('/parks/comments').get Yue Qin :white_check_mark:
     - ('/parks/comments').post Yue Qin :white_check_mark:
     - ('/parks/activities').get Yutong Wei :white_check_mark:
     - ('/parks/activities').post Yutong Wei :white_check_mark:
     - ('appointments').get Yuheng Xiao :white_check_mark:
     - ('appointments').post Yuheng Xiao :white_check_mark:
     - ('appointments/match').post Yuheng Xiao :white_check_mark:
   - Users:
     - ('/users').get Wenjing Zhou :white_check_mark:
     - ('/users/reviews').get Yue Qin :white_check_mark:
     - ('/users/reviews').post Yue Qin :white_check_mark:
     - ('/users/notification').get
     - ('/users/profile').get Wenjing Zhou :white_check_mark:
     - ('/users/profile').post

3. Frontend:
   - Home Page: Yue Qin :white_check_mark:
   - Login/Signup Page: Yue Qin :white_check_mark:
   - Park List Page:
   - User Profile Page:
   - Park activities management Page:
   - Activity Page: Yutong Wei :white_check_mark:
   - Park Activities Appointment Page: Yuheng Xiao :white_check_mark:

## Team Members

David Yang: parks page (database, routes, front end), single park page, edit park form, add new park form, favorite park feature. Refactoring

Yue Qin

Yutong Wei: In charge of activity section(database, routes, front end).

Yuheng Xiao: In charge of the feature of creating new activities (database, routes, front end), adding error checking and XSS for each router.

Wenjing Zhou: Complete the user profile page; single activity page; some routes of activity; data and routes of user; data and routes of appointment; data and reviews of reviews; page of myappointment and create new appointment; page of about; html check; 
## Github Repository

[https://github.com/davidtayloryangg/CS-546-Project]
