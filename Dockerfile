
FROM nginx:stable-alpine as production-stage
RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir /opt/certs
COPY default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
