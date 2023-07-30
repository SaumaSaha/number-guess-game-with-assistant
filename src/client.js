const net = require("node:net");
const { Assistant } = require("./assistant.js");
const { AssistantView } = require("./assistant-view.js");

const main = () => {
  const client = net.createConnection(8000);
  client.setEncoding("utf-8");

  client.on("connect", () => {
    const assistant = new Assistant();
    const view = new AssistantView();
    const assistantController = new AssistantController(
      assistant,
      client,
      view
    );
    assistantController.start();
  });
};

main();
