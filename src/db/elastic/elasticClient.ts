import { Client } from "@elastic/elasticsearch";
import { client } from "../dynamo/client";
require("dotenv").config()


export const elasticClient = new Client({
    cloud: { id: process.env.ELASTIC_ID! },
    auth: {
        username: process.env.ELASTIC_USERNAME!,
        password: process.env.ELASTIC_PASSWORD!
    },
})

const Add = async () => {
    const document = {
        index: "albums",
        id: "2",
        body: {
            title: "accusamus beate ",
            url: "https://idk",
            thumbUrl: "https://idk"
        }
    };
    elasticClient.index(document)
}

const Search = async () => {
    const response = await elasticClient.search({
        index: "albums",
        body: {
            size: 200,
            query: { match: { title: "accuaamus beate " } }
        }
    })

    console.log(response)
}