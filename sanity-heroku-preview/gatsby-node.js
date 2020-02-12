// const pjson = require(`./package.json`);
// const path = require(`path`);
const fs = require(`fs`);
const readlineSync = require(`readline-sync`);
const cmd = require(`node-cmd`);
const chalk = require(`chalk`);

// throw errors instead of chalk.red ??

let herokuAppName;

exports.onPreBootstrap = (_, options) => {
  if (!process.env.DATASET && !options.datasetToUse) {
    console.log(
      chalk.red.bold(
        `@lmack/preview-sanity: Please add a "DATASET" to your .env file OR add "datasetToUse" as an option of this plugin in your gatsby-config`
      )
    );
  }
  const datasetToUse = options.datasetToUse
    ? options.datasetToUse
    : process.env.DATASET;

  if (!process.env.PROJECT_ID && !options.projectID) {
    console.log(
      chalk.red.bold(
        `@lmack/preview-sanity: Please add a "PROJECT_ID" to your .env file OR add "projectID" as an option of this plugin in your gatsby-config`
      )
    );
  }
  const projectID = options.projectID
    ? options.projectID
    : process.env.PROJECT_ID;

  if (!process.env.SANITY_TOKEN && !options.sanityToken) {
    console.log(
      chalk.red.bold(
        `@lmack/preview-sanity: Please add a "SANITY_TOKEN" to your .env file OR add "sanityToken" as an option of this plugin in your gatsby-config`
      )
    );
  }
  const sanityToken = options.sanityToken
    ? options.sanityToken
    : process.env.SANITY_TOKEN;

  const netlifyEnvVars = `environment = {DATASET = "${datasetToUse}", PROJECT_ID = "${projectID}", SANITY_TOKEN = "${sanityToken}"}`;

  // ensures that a new heroku app isn't built when heroku does a build
  if (process.env.IS_HEROKU || process.env.IS_HEROKU === `true`) return;

  function setHerokuAppName() {
    // if no herokuAppName was set in gatsby-config, prompt user for name.
    console.log('OPTIONS', options);
    if (!options.herokuAppName) {
      herokuAppName = readlineSync.question(
        chalk.blue.bold(
          `@lmack/preview-sanity: Please provide a name for your heroku app (no spaces or capital letters): `
        )
      );
    } else {
      herokuAppName = options.herokuAppName;
    }
    console.log(
      chalk.green.bold(
        `@lmack/preview-sanity: Heroku app will be named ${herokuAppName}`
      )
    );
  }

  function setupRedirect() {
    // the slug for the netlify URL that will redirect to the heroku app
    const previewSlug = options.previewSlug ? options.previewSlug : `preview`;

    // if no static folder exists, create it
    if (!fs.existsSync(`./static`)) {
      console.log(
        chalk.green.bold(
          `@lmack/preview-sanity: Creating the static directory...`
        )
      );
      fs.mkdirSync(`./static`);
    }

    // if a _redirects file exists, check if it contains 'herokuapp'
    // if it does, user likely has already set this up so skip and move on
    // if it does NOT, append the heroku redirect string to the file
    // if a _redirects file does NOT exist, create it
    if (fs.existsSync(`./static/_redirects`)) {
      let fileContent = fs.readFileSync(`./static/_redirects`, `utf8`);
      if (fileContent.includes(`herokuapp`)) {
        console.log(
          chalk.yellow.bold(
            `@lmack/preview-sanity: Looks like you already have a heroku redirect set up. Check 'static/_redirects/'`
          )
        );
      } else {
        fs.appendFileSync(
          `./static/_redirects`,
          `/${previewSlug} https://${options.herokuAppName ||
            herokuAppName}.herokuapp.com/ 302`,
          err => {
            if (err) throw err;
            console.log(
              chalk.green.bold(
                `@lmack/preview-sanity: Added a redirect for heroku to your existing _redirects file`
              )
            );
          }
        );
      }
    } else {
      fs.writeFileSync(
        `./static/_redirects`,
        `/${previewSlug} https://${options.herokuAppName ||
          herokuAppName}.herokuapp.com/ 302`,
        err => {
          if (err) throw err;
          console.log(
            chalk.green.bold(
              `@lmack/preview-sanity: Successfully created _redirects in the "static" directory`
            )
          );
        }
      );
    }
  }

  function setupHerokuApp(oldName, newName) {
    // create the heroku app and required files (assumes user is logged in)
    console.log(
      chalk.green.bold(
        `@lmack/preview-sanity: Setting up Heroku app. Please wait...`
      )
    );
    if (fs.existsSync(`./Procfile`)) {
      console.log(
        chalk.yellow.bold(
          `@lmack/preview-sanity: Procfile already exists. Make sure your heroku dyno is properly set`
        )
      );
    } else {
      fs.writeFileSync(
        `Procfile`,
        `web: gatsby develop -p $PORT -H 0.0.0.0`,
        err => {
          if (err) throw err;
          console.log(
            chalk.green.bold(
              `@lmack/preview-sanity: Successfully created Procfile`
            )
          );
        }
      );
    }
    cmd.get(
      `
            heroku apps:rename ${newName} --app ${oldName}
            heroku config:set NODE_ENV=development --app ${newName}
            heroku config:set NPM_CONFIG_PRODUCTION=false --app ${newName}
            heroku config:set IS_HEROKU=true --app ${newName}
            heroku config:set SANITY_TOKEN=${sanityToken} --app ${newName}
            heroku config:set PROJECT_ID=${projectID} --app ${newName}
            heroku config:set DATASET=${datasetToUse} --app ${newName}
            heroku git:remote -a ${newName}
            `,
      function(err, data) {
        if (err) throw err;
        else
          console.log(
            chalk.green.bold(
              `@lmack/preview-sanity: Changed Heroku app name to ${newName} and set all required environment variables`
            )
          );
      }
    );
  }

  async function createHerokuApp() {
    let appInit = new Promise((resolve, reject) => {
      cmd.get(
        `
        heroku create
        `,
        function(err, data) {
          if (err) reject(err);
          else {
            // this gets the randomly generated app name which we need to rename the app
            let appName = data.substring(
              data.lastIndexOf('/') + 1,
              data.lastIndexOf('.git')
            );
            resolve(appName);
            console.log(
              chalk.green.bold(
                `@lmack/preview-sanity: Successfully created new Heroku app`
              )
            );
          }
        }
      );
    });
    let oldAppName = await appInit;
    setupHerokuApp(oldAppName, herokuAppName);
  }

  // Need to set Env Vars because .env file isn't being committed
  function setNetlifyEnvVars() {
    if (fs.existsSync(`./netlify.toml`)) {
      let fileContent = fs.readFileSync(`./netlify.toml`, `utf8`);
      if (fileContent.includes(`SANITY_TOKEN`)) {
        console.log(
          chalk.yellow.bold(
            `@lmack/preview-sanity: Looks like you already have a SANITY_TOKEN set up in your netlify.toml`
          )
        );
      } else {
        if (sanityToken) {
          fs.appendFileSync(`./netlify.toml`, netlifyEnvVars, err => {
            if (err) throw err;
            console.log(
              chalk.green.bold(
                `@lmack/preview-sanity: Added Netlify environment variables to netlify.toml`
              )
            );
            console.log(
              chalk.yellow.bold(
                `@lmack/preview-sanity: If you had previously set environment variables, make sure you combine them into one 'environment' object`
              )
            );
          });
        } else {
          console.log(
            chalk.red.bold(
              `@lmack/preview-sanity: Please add your SANITY_TOKEN to your .env file OR add "sanityToken" as an option of this plugin in your gatsby-config`
            )
          );
        }
      }
    } else {
      if (sanityToken) {
        fs.writeFileSync(`./netlify.toml`, `[build] ${netlifyEnvVars}`, err => {
          if (err) throw err;
          console.log(
            chalk.green.bold(
              `@lmack/preview-sanity: Successfully created netlify.toml with necessary environment variables`
            )
          );
        });
      } else {
        console.log(
          chalk.red.bold(
            `@lmack/preview-sanity: Please add your SANITY_TOKEN to your .env file OR add "sanityToken" as an option of this plugin in your gatsby-config`
          )
        );
      }
    }
  }

  if (!fs.existsSync(`./Procfile`)) {
    setHerokuAppName();
    setupRedirect();
    createHerokuApp();
    setNetlifyEnvVars();
  } else {
    setNetlifyEnvVars();
  }
};
