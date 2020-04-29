FROM node:12

# create destination directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# update and upgrade packages in Container
# RUN apt update && apt upgrade

# copy the app from Host computer to WORKDIR in container, note .dockerignore
COPY . .
RUN npm install
RUN npm run postinstall

# build our project, compile TS
RUN npm run build

# expose 5000 on container
EXPOSE 5000

# set app serving to permissive / assigned
# set app host
ENV HOST=0.0.0.0
# set app port
ENV PORT=5000

# start the app
CMD [ "npm", "start" ]

# to run, type e.g. :
# docker build . -t flintgg && docker run -p 4000:4000 flintgg
