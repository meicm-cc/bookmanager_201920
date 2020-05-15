# Bookmanager Authentication Service

## Defined Environment Variables

**SERVICE_PORT**: the port to which the service will bind. Currently only port is defined, if you need to define a specific IP address instead of allowing the service to bind to all available IPs you need to change the source code

**SERVICE_DB_HOSTNAME**: the hostname used to connect to the MongoDB instance

**SERVICE_DB_PORT**: the port used to connect to the MongoDB instance

**SERVICE_DB_NAME**: the name of the database used to connect to the MongoDB instance


## Other Notes

This service's Dockerfile is configured to be built everytime the code changes in order to better support a deployment scenario