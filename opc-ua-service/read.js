const opcua = require("node-opcua");
const dotenv = require('dotenv');
dotenv.config();

const endpointUrl = process.env.endpointUrl;
const nodeId = "ns=3;s=DipData";

const client = opcua.OPCUAClient.create({
    securityMode: opcua.MessageSecurityMode.SignAndEncrypt,
    securityPolicy: opcua.SecurityPolicy.Basic256Sha256,
    defaultSecureTokenLifetime: 40000,
    endpointMustExist: false,
});

async function readNodeValue() {
    try {
        // Connect to the server
        await client.connect(endpointUrl);
        console.log("Connected to", endpointUrl);

        // Create session
        const session = await client.createSession();
        console.log("Session created");

        // Read the node value
        const dataValue = await session.readVariableValue(nodeId);
        console.log(`Value of node ${nodeId}: ${dataValue.value.value}`);

        // Close session
        await session.close();
        console.log("Session closed");

        // Disconnect from the server
        await client.disconnect();
        console.log("Disconnected");
    } catch (err) {
        console.log("Error:", err);
    }
}

readNodeValue();
