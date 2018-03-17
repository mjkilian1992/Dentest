# Dentest - Michael Kilian

## Overview
Dentest was a web application designed to provide learning resources, mainly a database of questions and answers, to
student dentists. Random quizes can be generated from the question bank, with options to limit the questions presented
to a subset of the topics and alter the size of the quiz.

Users would subscribe yearly for access using [Braintree](https://www.braintreepayments.com/en-gb?locale=en-gb) to manage payments.
Free users would have access to a limited subset of the questions available to try the app out, while paid users could access all
questions and generate their own quizzes. 

I began on Dentest as a side project with a friend who is a dentist. Ultimately, we decided not to
progress with it. The code in this repository is presented as it was at the time we abandoned the project, at which time
I was in the process of trying to produce a deployable version to test as a prototype on a live server. Needless to say,
the code is far from perfect and would require significant work to productionize. I have included rough instructions for
setting up the required dependencies and running the server and front-end. 

## Tools and Requirements
Dentest was built using Django 1.7.8 and AngularJS 1.3.14. The project was created with the [CG-Angular](https://github.com/cgross/generator-cg-angular)
Yeoman generator. The linked documentation contains install instructions.

Dependencies can be found in:
+ `frontend/bower.json` for Bower dependencies
+ `frontend/package.json` for NPM components
+ `server/backend_requirements.txt` for the Django/Python dependencies

## Running Tests
Run the Jasmine tests for the Angular front-end by running `grunt test` from tgit he `frontend` folder.

Before running the server tests, you must set up the database first by running `python manage.py migrate`. Then use
`python manage.py test`

## Running Dentest
First start the server using `python manage.py runserver`. If this has succeeded use `grunt server` to start the front-end.

The web app will be available at `localhost:9001` and the Django server is available at `localhost:8000`.
