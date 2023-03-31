import { exec } from "child_process";

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;


function runCommand(command:string):Promise<String>{
  return new Promise((resolve,reject)=>{
    exec(command,(error,stdout,stderr)=>{
      if(error){reject(error);}
      else if(stdout){
        resolve(stdout);
      }else{
        reject(stderr);
      }
    });
  });
}


module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  /// start the test database 
  console.log(await runCommand("docker compose up"));

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};
