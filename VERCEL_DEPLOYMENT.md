# Deploying HyperSonic to Vercel

This guide will walk you through deploying your HyperSonic habit tracker app to Vercel.

## Important Notes

- **User Data Storage**: This app stores all user data in the browser's localStorage. Each user who visits your deployed site will have their own private data stored locally in their browser.
- **No Backend Required**: Since all data is stored in the browser, the app runs as a static website with no server needed.
- **Privacy**: User data never leaves their browser and is completely private.

## Prerequisites

- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (you can sign up with your GitHub account)
- Your code pushed to a GitHub repository

## Deployment Steps

### Step 1: Push Your Code to GitHub

If you haven't already, push your code to GitHub:

1. Create a new repository on GitHub
2. In your Replit workspace, initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Connect to your GitHub repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New..." → "Project"
3. Select your HyperSonic repository from the list
4. Vercel will automatically detect the configuration from `vercel.json`

### Step 3: Configure Build Settings

Vercel should automatically use the settings from your `vercel.json` file:
- **Build Command**: `vite build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

If needed, you can verify or adjust these in the Vercel dashboard.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually takes 1-2 minutes)
3. Once deployed, you'll get a URL like `https://your-app-name.vercel.app`

### Step 5: Custom Domain (Optional)

To use your own domain:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Configuration Files

The following files are used for Vercel deployment:

- **vercel.json**: Main configuration file
  - Specifies build command and output directory
  - Sets up routing for single-page application

- **.vercelignore**: Specifies files to exclude from deployment
  - Reduces deployment size
  - Excludes development and server files

## Testing Your Deployment

After deployment:

1. Visit your Vercel URL
2. Add some daily goals and habits
3. Close the browser and reopen it - your data should persist
4. Each user who visits the site will have their own separate data

## Troubleshooting

### Build Fails

If the build fails:
- Check the build logs in Vercel dashboard
- Ensure all dependencies are listed in `package.json`
- Try building locally with `vite build` to see if there are any errors

### App Doesn't Load

If the app loads but shows a blank page:
- Check the browser console for errors
- Verify the `outputDirectory` in `vercel.json` matches your Vite config
- Check that the routing is configured correctly in `vercel.json`

### Data Not Persisting

If user data doesn't persist:
- Check browser console for localStorage errors
- Ensure the browser allows localStorage (some private browsing modes block it)
- Verify that localStorage keys are being set correctly

## How User Data Works

**Important**: This app uses browser localStorage, which means:

✅ **Pros:**
- Complete privacy - data never leaves the user's browser
- No server costs for data storage
- Works offline after initial load
- Fast performance

❌ **Cons:**
- Data is tied to the specific browser and device
- Clearing browser data will delete the app data
- No sync between devices
- Limited to ~5-10MB of storage per domain

## Environment Variables

This app doesn't require any environment variables since it runs entirely in the browser. If you add any in the future:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add your variables for Production, Preview, and Development environments

## Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy your `main` branch to production
- Create preview deployments for pull requests
- Deploy branches when you push changes

## Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/community)

For app-specific issues, refer to the main project documentation.
