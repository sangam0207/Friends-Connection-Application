# Twin Sentience 

Twin Sentience Dapp is a combination on Twin Dapp and Sentience Wallet

## Table of Contents

- [Requirements](#requirements)
  - [Node](#node)
    - [Node installations on Windows](#node-installation-on-windows)  
    - [Node installations on Ubuntu](#node-installation-on-ubuntu)
    - [Other Operating Systems](#other-operating-systems)
- [Install](#install)
- [Configure environment variables](#configure-environment-variables)
- [Running the project](#running-the-project)
- [Running the project in development mode](#running-the-project-in-development-mode)

---
## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v20.13.1

    $ npm --version
    10.5.2

## Install

    $ git clone https://github.com/vDoIT-Technologies/sentience-twin-backend.git
    $ cd sentience-twin-backend
    $ npm install

## Configure environment variables

Please refer the .env-example file

## Running the project

    $ npm run start

## Running the project in development mode

    $ npm run dev
