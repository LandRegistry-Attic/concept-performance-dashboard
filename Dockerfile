FROM orchardup/python:2.7
RUN apt-get update -qq && apt-get install -yq bundler
RUN mkdir /code
WORKDIR /code
ADD Gemfile /code/
RUN bundle install
ADD . /code
