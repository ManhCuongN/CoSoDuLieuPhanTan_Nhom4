FROM node:16.15.0

# Create app directory
WORKDIR /usr/src/app

ENV NAME="TOPIC MANAGEMENT TOOL"
ENV PORT=3000


ENV GOOGLE_CLIENT_ID="648042025653-etp74g4m2perlqkf2oh0q36gsvttq4l0.apps.googleusercontent.com"
ENV GOOGLE_CLIENT_SECRET="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"
ENV DATABASE_URL="mongodb+srv://admin:admin@cluster0.djyj4.mongodb.net/topic-management-tool?retryWrites=true&w=majority"
ENV JWT_SECRET_KEY="dhha"
ENV ADMIN_SECRET="admin"


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]