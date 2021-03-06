'use strict';

const readline = require('readline');
const ympp = require('../../lib');

if (!module.parent) {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let args = {
    id: 'anonymous',
    token: 'none',
    url: 'ws://localhost:3000'
  };

  ympp.client.connect(args, (err, cli) => {

    if (err) {
      console.error(err);
      process.exit(-1);
    }

    console.log('connected to server');

    cli
      .on('message', (msg) => {
        console.log('>>', msg.content.data.toBuffer().toString());
      })
      .once('close', () => {
        console.log('connection closed');
        process.exit(0);
      });

    cli.receive();

    rl.on('line', (line) => {

      let msg = ympp.message({
        intent: 'echo',
        content: {
          data: new Buffer(line)
        }
      });

      cli.send(msg, (err) => {
        if (err) console.error(err);
      });

    });

  });
}

