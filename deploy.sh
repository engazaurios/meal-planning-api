#!/bin/bash

# Script to deploy frontend in server.

function execute_in_server() {
	ssh engazaurio@67.205.147.22 "export PATH=$PATH:/usr/local/nvm/versions/node/v10.16.3/bin:/usr/local/node/bin && ${1}"
}

# In order to checkout a specific branch, you must do the following before running the script:
# export BRANCH="<branch_name>"

# Checkouts custom branch and pulls from it
if [[ -z "${BRANCH}" ]]; then
	export BRANCH=develop
fi
execute_in_server 'cd ~/meal-planning-api && git checkout '${BRANCH}' && git pull origin '${BRANCH}

# In order to install packages, you must do the following before running the script:
# export INSTALL_PACKAGES=yes

# Installs packages
if [[ ! -z "${INSTALL_PACKAGES}" ]]; then
	echo "---> Installing packages."
	execute_in_server 'source ~/.profile && cd ~/meal-planning-api && npm install'
fi

echo "---> Starting production environment."
execute_in_server 'cd ~/meal-planning-api && pm2 restart server'