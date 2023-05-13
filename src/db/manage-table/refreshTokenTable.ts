import { DynamoDBClient, CreateTableCommand, CreateTableCommandInput, DeleteTableCommand, } from "@aws-sdk/client-dynamodb"
import { client } from "../client";

const input: CreateTableCommandInput = {
    TableName: "RefreshToken",
    KeySchema: [
        { AttributeName: "refreshToken", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
        { AttributeName: "refreshToken", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 100
    }
}

const createRefreshTokenTable = async () => {
    try {
        const results = await client.send(new CreateTableCommand(input));
        console.log(results)
    } catch (err) {
        console.error(err)
    }
}

const deleteRefreshTokenTable = async () => {
    await client.send(new DeleteTableCommand({TableName: "RefreshToken"}));
}


createRefreshTokenTable()
