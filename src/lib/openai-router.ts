import { IRequest, Router } from "itty-router";
import schemaPluginDefault from "../schemas/api-plugin.json";
import schemaOpenApiDefault from "../schemas/openapi.json";

export interface CustomRequest extends IRequest {
  metadata?: {
    [x: string]: string;
  };
}

interface OpenAIRouterOptions {
  plugin?: {
    nameHuman: string;
    nameModel: string;
    descriptionHuman: string;
    descriptionModel: string;
  };
}

export const OpenAIRouter = (options?: OpenAIRouterOptions) => {
  const router = Router();
  router
    .get("/openapi.json", (request, args) => schemaOpenApi(request, args, options))
    .get("/.well-known/ai-plugin.json", (request, args) => schemaPlugin(request, args, options));

  return router;
};

const schemaOpenApi = (request: CustomRequest, args: any, options?: OpenAIRouterOptions) => {
  const host = request.headers.get("host") || "/";
  let schema = JSON.parse(JSON.stringify(schemaOpenApiDefault));
  schema.servers[0].url = `https://${host}`;
  return new Response(JSON.stringify(schema), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};

const schemaPlugin = (request: CustomRequest, args: any, options?: OpenAIRouterOptions) => {
  const host = request.headers.get("host") || "/";
  let schemaPlugin = JSON.parse(JSON.stringify(schemaPluginDefault));
  const schemaPluginApi = Object.assign(schemaPlugin.api, { url: `https://${host}${schemaPlugin.api.url}` });
  const schema = Object.assign(schemaPlugin, { api: schemaPluginApi });
  return new Response(JSON.stringify(schema), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};
