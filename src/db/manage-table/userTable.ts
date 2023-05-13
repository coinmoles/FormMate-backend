import { DynamoDBClient, CreateTableCommand, CreateTableCommandInput, DeleteTableCommand, } from "@aws-sdk/client-dynamodb"
import { client } from "../client";

const input: CreateTableCommandInput = {
    TableName: "User",
    KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 100
    }
}

const createUserTable = async () => {
    try {
        const results = await client.send(new CreateTableCommand(input));
        console.log(results)
    } catch (err) {
        console.error(err)
    }
}

const deleteUserTable = async () => {
    await client.send(new DeleteTableCommand({TableName: "User"}));
}


createUserTable()
