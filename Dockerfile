# as there is something broken since 3.14 we need to stick on this older version
FROM alpine:3.12

# Replacement for MAINTAINER (deprecated)
LABEL maintainers="REISENBAUER Andreas <reisenba@gmx.at>"

# Add Tini, then create Group and User
RUN apk add --no-cache nodejs npm && \
    mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install --no-optional
EXPOSE 8110

CMD ["node", "camEvents.js"]