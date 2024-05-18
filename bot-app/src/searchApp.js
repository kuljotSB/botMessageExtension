const axios = require("axios");
const querystring = require("querystring");
const { TeamsActivityHandler, CardFactory } = require("botbuilder");
const ACData = require("adaptivecards-templating");
const helloWorldCard = require("./adaptiveCards/helloWorldCard.json");

class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  // Message extension Code
  // Search.
  async handleTeamsMessagingExtensionQuery(context, query) {
    const searchQuery = query.parameters[0].value;
    const notParsedResponse = await axios.get(
      `https://kuljot-webapp.azurewebsites.net/get-listings?city=${searchQuery}`
    );

    const attachments = [];

// Assuming you have already defined the helloWorldCard template
const response = notParsedResponse.data;

response.forEach((property) => {
  const template = new ACData.Template(helloWorldCard);
  const card = template.expand({
    $root: {
      name: property.title,
      description: property.description,
    },
  });
  const preview = CardFactory.heroCard(property.title);
  const attachment = { ...CardFactory.adaptiveCard(card), preview };
  attachments.push(attachment);
});

// Now 'attachments' contains the adaptive cards for each property
// You can use these attachments in your chatbot as needed

    

    return {
      composeExtension: {
        type: "result",
        attachmentLayout: "list",
        attachments: attachments,
      },
    };
  }
}

module.exports.SearchApp = SearchApp;
