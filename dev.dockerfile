FROM mcr.microsoft.com/devcontainers/base:jammy

WORKDIR /workspaces
COPY dev-config.sh /dev-config.sh
RUN chmod +x /dev-config.sh

ENTRYPOINT [ "/dev-config.sh" ]