const Workflow = require("@saltcorn/data/models/workflow");
const Form = require("@saltcorn/data/models/form");
const Table = require("@saltcorn/data/models/table");
const View = require("@saltcorn/data/models/view");


class Configuration {
    constructor(param = {}) {
        this.apiKey = param.apiKey;
    }
}

const configuration_workflow = () =>
  new Workflow({
    steps: [
      {
        name: "API key",
        form: async (context) => {
          return new Form({
            fields: [
              {
                name: "api_key",
                label: "API key",
                sublabel: "API Key for third party API",
                type: "String",
              },
            ],
          });
        },
      },
    ],
  });

const functions = ({ api_key }) => ({
  get_search_results: {
    run: async (prompt, options = {}) => {
      const configuration = new Configuration({
        apiKey: api_key,
      });
      console.log("##############");
      console.log(configuration);
      console.log("query: ", prompt);
      console.log("options: ", options);
      console.log("##############");

      // make an api call here

      // process the response. Use npm package outside of saltcorn here..

      // for now, just return prompt and options as a response back to user
      return {"prompt": prompt, "options": options};
    },
    isAsync: true,
    description: "calling third party API..",
    arguments: [{ name: "prompt", type: "String" }],
  },
});

const viewtemplates = ({ api_key }) => {
    return [
        {
            name: "api results view",
            display_state_form: false,
            configuration_workflow: () =>
                new Workflow({
                    steps: [],
                }),
            get_state_fields: () => [],
            run: async (table_id, viewname, state, { req, res }) => {
                const { prompt, options } = state;
                const html = `<h1>API Results for: ${prompt}</h1>`;
                
                // print all properties of res
                for (const prop in res) {
                    console.log(prop + ": " + res[prop]);
                }

                // res.send is undefined..
                res.send(html);
            },
        },
    ];
};
  
module.exports = {
  sc_plugin_api_version: 1,
  configuration_workflow,
  functions,
  viewtemplates,
};
