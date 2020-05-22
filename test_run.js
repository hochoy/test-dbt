const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const waitMs = require('util').promisify(setTimeout);
const BASE_URL = 'http://localhost:8580/jsonrpc'


// helper function to poll for result every 20 milliseconds
const pollForResult = async (token) => {

  const body = {
    jsonrpc: '2.0',
    method: 'poll',
    id: uuidv4(),
    params: { request_token: token, logs: true, logs_start: 0 }
  };

  const response = await axios.post(BASE_URL, body);

  if (response.data && response.data.error && response.data.error.data) {
    console.error(response.data.error.data)
    throw response
  }

  if (response.data.result.state === 'running') {
    await waitMs(20);
    return pollForResult(token);
  }

  return response.data;
};

// main function to call dbt rpc to compile dbt macro
const compileMacro = async (macroName, macroInput) => {

  // create macro body text
  const macroText = `{{
    ${macroName}(
      input=${macroInput}
    )
  }}`;

  const base64 = Buffer.from(macroText).toString('base64');

  // construct and send request body
  const body = {
    jsonrpc: '2.0',
    method: 'compile_sql',
    id: uuidv4(),
    params: { timeout: 60, sql: base64, name: macroName }
  }

  // const body = {
  //   "jsonrpc": "2.0",
  //   "method": "ps",
  //   "id": "2db9a2fe-9a39-41ef-828c-25e04dd6b07d",
  //   "params": {
  //       "completed": true
  //   }
  // }

  const response = await axios.post(BASE_URL, body);

  // use request token to poll for result
  const token = response.data.result.request_token;

  const pollResponse = await pollForResult(token)

  // extract compiled sql from polled result
  const { compiled_sql: sql } = pollResponse.result.results[0];

  const logBody = {
    compileBody: body,
    compileResponse: response.data,
    compileToken: token,
    pollResult: sql
  }

  // console.log(logBody)

  return sql
}

const compileMacroArray = async (arrayToMap) => {

  const promises = arrayToMap
    .map(async (input) => {
      const sql = await compileMacro('macro1',input)

      return sql
    })

  // test out parallel call
  const results = await Promise.all(promises)

  return results
}

const arrayToMap = [1,2,3,4]

compileMacroArray(arrayToMap)
  .then(res => console.log(res))
