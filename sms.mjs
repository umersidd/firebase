const SERVICE_PLAN_ID = 'fda2693e86b34cd78fe83cc0adad49bb';
const API_TOKEN = 'b2f9aef8bca2470f9ec32da52b95fc93';
const SINCH_NUMBER = '447520651580';
const TO_NUMBER = '923102582051';

import fetch from 'node-fetch';
// const fetch = require('node-fetch');
async function run(number) {
  const resp = await fetch(
    'https://us.sms.api.sinch.com/xms/v1/' + SERVICE_PLAN_ID + '/batches',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + API_TOKEN
      },
      body: JSON.stringify({
        from: SINCH_NUMBER,
        to:TO_NUMBER,
        body: 'Programmers are tools for converting caffeine into code. We just got a new shipment of mugs! Check them out: https://tinyurl.com/4a6fxce7!'
      })
    }
  );

  const data = await resp.json();
  console.log(data);
}

// run();