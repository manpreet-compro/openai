/* eslint-disable @typescript-eslint/no-var-requires */

// Import OpenAI API
// import OpenAI from 'openai';
// import * as fs from 'node:fs';

const { OpenAI } = require("openai");
const fs = require("fs");

const green = "\x1b[32m";

// Define a function to get a response from the OpenAI API.
// Documentation: https://platform.openai.com/docs/guides/chat
const getResponse = async (openai, request) => {
  const completion = await openai.chat.completions.create(request);

  const review = completion?.choices[0]?.message?.content;
  return review;
};

// Get the file path from the command line.
console.log(process.argv);
const filePath = process.argv[2];
if (!filePath) {
  console.error("Please provide a folder path.");
  process.exit(1);
}

// Read the file and get the code.
const code = fs.readFileSync(filePath, "utf-8");

const textInput = `For the following vue file, Convert the HTML content to make it AAA accesible. Do not change anything in script and styles. Provide the updated vue file as the result.`;

// Build the prompt for OpenAI API.
const prompt = `${textInput}

${code}
`;

if (prompt == null) {
  console.error("Please provide a valid command.");
  process.exit(1);
}

// Config OpenAI API.
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function startScript() {
  // Get a response from OpenAI API.
  const response = await getResponse(openai, {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  console.log(`Conversion Done`);
  await fs.writeFileSync("result.vue", response.toString(), {
    encoding: "utf-8",
  });
}

startScript();
