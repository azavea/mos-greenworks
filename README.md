# mos-greenworks-visualization
City of Philadelphia Mayor's Office of Sustainability Greenworks Report

## Developing

To set up a dev environment on your local machine, run the following:
```
# Ruby gems for css compilation
gem install sass compass

# Ruby gem for deployment
# Requires java jre to be installed on your system
gem install s3_website

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

### Updating cartodb.js

Ensure when updating that the try catch check in the vis-service.js get() function is still valid
for the newer version of cartodb.js.

TODO: Add a js test for this condition


## Testing

Install the dependencies as listed above, then:
```
grunt test
```


## Deploying

First, ensure bower components are up to date:
```
bower install
```

Then, build the minified app with:
```
grunt build
```

Configure s3_website for deployment by setting the following ENV variables:
  - GREENWORKS_ACCESS_KEY
  - GREENWORKS_SECRET_KEY

Once the AWS access keys are set in your environment, deploy the app:
```
s3_website push --force
```

If you want to change the bucket the app deploys to, edit the `s3_bucket` setting in s3_website.yml

If you change the bucket, ensure you setup static hosting and bucket permissions via the AWS console.