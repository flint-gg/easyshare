# What's easyshare?

A tool to easily and safely get the media from your Nintendo Switch to where you actually want it.
We do this by leveraging the ability to direclty post to Twitter from the Switch. Our system tracks specific hashtags on Twitter, and if you set up an Account we can get the media from it, optionall delete the tweet, and then upload your media to Google Photos.

We are already looking for new additions which you can find on [our roadmap](https://github.com/flint-gg/microservice-switch-share/projects/1).

# How you can help

This project is completely open source. If you find bugs, want to optimize the code, or are just looking for new features, feel free to open an issue or a pull request on this repository!

## Development

install dependencies
`npm i`

rename `removeThisPartBeforeTheDot.env` to `.env` and fill in your tokens. You will also need to adjust the Twitter and Google Photos Client IDs inside the code.

run development environment
`npm run dev`

## Deployment

build the project
`npm run build`

run project
`npm run start`
