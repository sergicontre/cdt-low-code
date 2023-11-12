const opcua = require("node-opcua");
const nodeIds = require('./nodeIds.json')[0].OpcNodes;
const dotenv = require('dotenv');
dotenv.config();

const endpointUrl = process.env.endpointUrl;

console.log(endpointUrl)

// Create an OPC UA client
const client = opcua.OPCUAClient.create({
    securityMode: opcua.MessageSecurityMode.SignAndEncrypt,
    securityPolicy: opcua.SecurityPolicy.Basic256Sha256,
    defaultSecureTokenLifetime: 40000,
    endpointMustExist: false,
});

async function getAddresses() {
    try {
        // Connect to the server
        await client.connect(endpointUrl);
        console.log("Connected to", endpointUrl);

        // Create session
        const session = await client.createSession();
        console.log("Session created");

        // Get the namespace array
        const namespaceArrayNode = opcua.makeNodeId(opcua.VariableIds.Server_NamespaceArray);
        const dataValue = await session.readVariableValue(namespaceArrayNode);
        const namespaceArray = dataValue.value.value;

        const addresses = [];

        for (let index = 0; index < nodeIds.length; index++) {
            const element = nodeIds[index];
            // Find the index of the namespace
            const namespaceUri = element.Id.split(';')[0].split('=')[1];
            const namespaceIndex = namespaceArray.indexOf(namespaceUri);
            addresses.push(`ns=${namespaceIndex};${element.Id.split(';')[1]}`)
            console.log(`ns=${namespaceIndex};${element.Id.split(';')[1]}`)
        }

        // Close session
        await session.close();
        console.log("Session closed");

        // Disconnect from the server
        await client.disconnect();
        console.log("Disconnected");
        return addresses;

    } catch (err) {
        console.log("Error:", err);
        return null;
    }
}

getAddresses();

module.exports = getAddresses;
