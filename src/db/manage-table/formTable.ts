import { CreateTableCommand, CreateTableCommandInput, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../client";


const input: CreateTableCommandInput = {
    TableName: "Form",
    KeySchema: [
        { AttributeName: "formId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
        { AttributeName: "formId", AttributeType: "S" },
        { AttributeName: "updated", AttributeType: "S" },
        { AttributeName: "author", AttributeType: "S" },
        { AttributeName: "category", AttributeType: "S" },
        { AttributeName: "useCount", AttributeType: "N" }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "authorIndex", 
            KeySchema: [
                { AttributeName: "author", KeyType: "HASH" },
                { AttributeName: "updated", KeyType: "RANGE" }
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 100
            }
        },
        {
            IndexName: "categoryIndex", 
            KeySchema: [
                { AttributeName: "category", KeyType: "HASH" },
                { AttributeName: "useCount", KeyType: "RANGE" }
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 100
            }
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 100
    }
}

const createFormTable = async () => {
    try {
        const results = await client.send(new CreateTableCommand(input));
        console.log(results)
    } catch (err) {
        console.error(err)
    }
}

const deleteFormTable = async () => {
    await client.send(new DeleteTableCommand({TableName: "Form"}));
}


createFormTable()
