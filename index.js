const { OpenAI } = require("openai");
const fs = require("fs").promises;
const path = require("path");

// Define a function to get a response from the OpenAI API.
const getResponse = async (openai, request) => {
  const completion = await openai.chat.completions.create(request);

  const review = completion?.choices[0]?.message?.content;
  return review;
};

// Function to process the file content
async function processContent(content) {
  const prompt = `For the following vue file, Convert the HTML content to make it AAA accesible. Do not change anything in script and styles. Provide the result in .vue file.
  
  ${content}`;
  const response = await getResponse(openai, {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return response;
}

// Create an instance of the OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Directory containing the files
console.log(process.argv);
const directoryPath = process.argv[2];
if (!directoryPath) {
  console.error("Please provide a folder path.");
  process.exit(1);
}

async function processFiles() {
  try {
    // Read the directory
    const files = await fs.readdir(directoryPath);

    // Process each file
    for (const file of files) {
      const filePath = path.join(directoryPath, file);

      try {
        // Read the file
        const data = await fs.readFile(filePath, "utf8");

        // Process the content
        const processedContent = await processContent(data);

        // Write the processed content back to the same file
        await fs.writeFile(filePath, processedContent, "utf8");

        console.log("File has been processed and saved:", file);
      } catch (err) {
        console.error("Error processing file:", file, err);
      }
    }
  } catch (err) {
    console.error("Error reading the directory:", err);
  }
}

processFiles();
