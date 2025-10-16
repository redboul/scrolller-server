import { CLIENT_ID, CLIENT_SECRET, PASSWORD, USERNAME } from "../../../secret/env.ts";
import { Handler } from "../handler.ts";
import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";

const LOAD_ALL_ENTRIES_ROUTE = new URLPattern({ pathname: "/category" });

export class GetNextPage implements Handler {
    private logger = new Logger();
    private token: String;
    constructor() {
        this.getAccessToken();
    }
    match(req: Request) {
        return LOAD_ALL_ENTRIES_ROUTE.test(req.url) && req.method === 'GET';
    }
    
    async fetchUrl (category: String, sortOrder: String, limit: String, count: String, after: String) {
        // `https://www.reddit.com/r/${category}/${sortOrder.value}.json?limit=${nbOfItems}&count=${postList.state?.posts?.length ?? 100}&after=${postList.state.after}&f=${queryParams.value}`,{
        const url = `https://oauth.reddit.com/r/${category}/${sortOrder}.json?limit=${limit}&count=${count}&after=${after}`;

        const response = await fetch(url,
            {
            method: 'GET',
            headers: {
                "Authorization": `bearer ${this.token}`,
            }
            }
        );
        return response.json();
    }


    async getAccessToken() {
        const clientId = CLIENT_ID;
        const clientSecret = CLIENT_SECRET;
        const username = USERNAME;
        const password = PASSWORD;

        const response = await fetch("https://www.reddit.com/api/v1/access_token", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(`${clientId}:${clientSecret}`),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "password",
                username: username,
                password: password
            })
        });

        const data = await response.json();
        this.token = data.access_token;
    }

    serve(_req: Request) {
      const matcher = LOAD_ALL_ENTRIES_ROUTE.exec(_req.url);
      if(matcher) {
        const url = new URL(_req.url);
        const category = url.searchParams.get('category') ?? '';
        const sortOrder = url.searchParams.get('sortOrder') ?? '';
        const nbOfItems = url.searchParams.get('nbOfItems') ?? '';
        const count = url.searchParams.get('count') ?? '0';
        const after = url.searchParams.get('after') ?? '';

        return this.fetchUrl(category, sortOrder, nbOfItems, count, after).then((entries) => {
                return Response.json(entries, {
                headers: {
                    "content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                });
            }
            );
        }
    }
}