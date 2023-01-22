FROM resin/rpi-alpine:3.7

# Replacement for MAINTAINER (deprecated)
LABEL maintainers="REISENBAUER Andreas <reisenba@gmx.at>"

# Add Tini, then create Group and User
RUN apk add --no-cache tini nodejs nodejs-npm && \
    mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install --no-optional
EXPOSE 8110

CMD ["node", "camEvents.js"]