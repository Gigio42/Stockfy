# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Expose port 5432 to allow communication to/from server 
EXPOSE 5432

# Add a health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1

# Run the rest of the commands as the ``postgres`` user created by the ``postgres`` Docker image
USER postgres

# Set the working directory
WORKDIR /var/lib/postgresql/data

# These commands will be run when the Docker container starts
CMD ["postgres"]