FROM stackbrew/ubuntu:13.10
RUN apt-get update -qq && apt-get install -yq software-properties-common
RUN apt-add-repository ppa:chris-lea/node.js
RUN apt-get update -qq && apt-get install -yq build-essential nodejs ruby1.9.1 ruby1.9.1-dev rubygems python
RUN gem install bundler
RUN mkdir /code
WORKDIR /code
ADD Gemfile /code/
RUN bundle install
RUN npm install -g grunt-cli
ADD package.json /code/
RUN npm install
ADD . /code
