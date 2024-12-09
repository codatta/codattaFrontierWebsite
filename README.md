![brand-image](https://raw.githubusercontent.com/codatta/assets/refs/heads/main/brand-image.svg)

# Codatta Dialects Voice Website
The website for the Codatta Frontier Platform, build with Vite, React, Tailwind and Typescript.

## Quick start

### Get the prerequisites

**Node.js**
The latest stable LTS release of Node.js is required to build the site. If you don't have Node.js or need to update, download your computer's corresponding version and follow the instructions from the [Node.js download archive](https://nodejs.org/en/download/). If you prefer, you can use a version manager such as [nvm](https://github.com/nvm-sh/nvm), and run nvm install from the repository's root directory.

If you already have Node installed, verify it's available on your path and already the latest stable version:

```shell
node --version
```

We recommend using Node.js version 20 or above.


### Get the source code

If you're not a member of the Codatta organization, we recommend you create a fork of this repo under your own account, and then submit a PR from that fork.

### Install dependencies

We recommend using npm as the package manager. To install the dependencies, run the following command in the project root directory:
```shell
npm install
```

### Create .env file

You can create an `.env` file based on the `.env.example` file and fill in the relevant information. You can ignore the correct values of these variables. Although in most cases it will not affect your development experience, in some cases, you may need to fill in these variables correctly.

Please note that the `.env` file will not be committed to the git repository.

You can also create an `.env` file quickly using the following command:

```shell
cp .env.example .env
```

### Change proxy server
You can change the proxy server in the `vite.config.ts` file.
```ts
server: {
    proxy: {
        '/api': {
            // you can change the target to your own proxy server
            // or use the default proxy server
            target: 'https://app-test.b18a.io',
            // ...
        }
    }
}
```

### Start to dev
Now you can start developing. Run the following command to start the development server:
```shell
npm run dev
```

### If you are using VSCode
For you development experience, we include some vscode settings in the `.vscode` directory.
We highly recommend you install the following extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  
  highlight syntax errors and warnings

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

  IntelliSense for Tailwind CSS

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

  format code






