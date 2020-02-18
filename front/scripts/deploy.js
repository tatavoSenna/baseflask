var exec = require('child_process').exec;

var cmd = `
  npm run build;
  rm -Rf node-express/public/*.*;
  cp -R build/* node-express/public/;
  cd node-express;
  git init;
  git add ./;
  git commit -m "new build";
  eb use doing-law-web-app;
  eb deploy;
  rm -rf .git;
`;

var process = exec(cmd, function(error, stdout, stderr) {
  if(error !== null) {
    console.log(error);
    return;
  }

  console.log(stdout);
});

process.stdout.on('data', function(data) {
  console.log(data);
})
