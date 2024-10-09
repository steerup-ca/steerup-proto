# steerup-proto

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Local Development

To run the project locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
   This will run the app in development mode. Open [http://localhost:3002](http://localhost:3002) to view it in the browser.

## GitHub Pages Deployment

This project is set up for automatic deployment to GitHub Pages using GitHub Actions. The deployment process is triggered automatically when changes are pushed to the `main` branch.

### Manual Deployment

If you need to deploy manually:

1. Build the project for GitHub Pages:
   ```
   npm run build:gh-pages
   ```
2. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

### Viewing the Deployed Site

After deployment, you can view your app at: `https://steerup-ca.github.io/steerup-proto`

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production to the `build` folder
- `npm run build:gh-pages`: Builds the app for GitHub Pages deployment
- `npm run deploy`: Deploys the app to GitHub Pages

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
