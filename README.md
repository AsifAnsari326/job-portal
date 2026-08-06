# Hyre Job Portal

Hyre is a modern job portal web application built with Angular 22 and a mock backend, designed to showcase a complete job search and application experience for job seekers.

It includes authentication, job discovery, saved jobs, job applications, and a dashboard — all wrapped in a polished, responsive UI that is suitable for a portfolio or resume project.

## Features

- User authentication with login and signup flows
- Job listings with search and filtering
- Pagination for browsing more jobs
- Job detail page with full role information
- Save jobs to a personal shortlist
- Apply to jobs with a submission form
- Dashboard to view saved jobs and applications
- Responsive layout for desktop and mobile screens

## Tech Stack

- Angular 22
- TypeScript
- RxJS
- Bootstrap 5 and Bootstrap Icons
- Express + JSON Server for mock API data
- SCSS for styling

## Project Structure

```text
src/
  app/
    core/            # services, guards, models, interceptors
    features/        # auth, jobs, companies, dashboard, saved jobs
    shared/          # reusable UI components
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or newer recommended)
- npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/hyre-job-portal.git
   cd hyre-job-portal
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the mock API server
   ```bash
   npm run api
   ```

4. Start the Angular app
   ```bash
   npm start
   ```

5. Open your browser and visit
   ```text
   http://localhost:4200
   ```

## Available Scripts

```bash
npm start        # start the Angular development server
npm run build    # build the app for production
npm run api      # start the local JSON mock backend
npm test         # run unit tests
```

## Deployment

This app is ready to be deployed to platforms such as:

- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages

For a production deployment, build the app with:

```bash
npm run build
```

Then deploy the contents of the dist folder to your hosting provider.

## Screenshots

You can add screenshots here once you have them ready for the repo:

```text
![Homepage](./public/screenshots/home.png)
![Dashboard](./public/screenshots/dashboard.png)
```

## Notes

This project is designed as a polished frontend portfolio project and can be extended with:

- real backend integration
- role-based access control
- email notifications
- advanced analytics and filters

## License

This project is open-source and available under the MIT License.

