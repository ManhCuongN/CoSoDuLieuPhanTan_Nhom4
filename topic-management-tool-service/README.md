Run dev:
    npm run dev
Run test:
    npm test

Docker:
heroku login
heroku container:login
 heroku container:push web --app topic-management-tool-service
 heroku container:release web --app topic-management-tool-service
 heroku logs --tail --app topic-management-tool-service