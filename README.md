# mos-greenworks-visualization
City of Philadelphia Mayor's Office of Sustainability Greenworks Report

## Developing

To set up a dev environment on your local machine, run the following:
```
# Ruby gems for css compilation
gem install sass compass

# Global npm packages for dev
npm install -g grunt-cli bower

# Install project dependencies
npm install
bower install
```

Note: These commands assume you have ruby and node installed locally. If using your host machine's
default distributions, you'll need to prefix the first two commands with sudo.

We highly recommend setting up local installations using RVM and NVM for ruby and node respectively
so you don't need admin rights.

Once the above dependencies are installed, run the dev grunt server with:
```
grunt serve
```

The app will be served at http://localhost:9000


## Testing

Install the dependencies as listed above, then:
```
grunt test
```


## Deploying

Build the minified app with:
```
grunt build
```

TODO: Deploy notes, via s3_website