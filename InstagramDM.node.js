const { IExecuteFunctions } = require('n8n-core');
const { INodeType, INodeTypeDescription } = require('n8n-workflow');
const { Client } = require('instagrapi');

class InstagramDM {
    description = {
        displayName: 'Instagram DM',
        name: 'instagramDM',
        group: ['transform'],
        version: 1,
        description: 'Send Instagram Direct Messages',
        defaults: {
            name: 'Instagram DM',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Instagram Username',
                name: 'username',
                type: 'string',
                default: '',
                required: true,
                description: 'Your Instagram account username',
            },
            {
                displayName: 'Instagram Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'Your Instagram account password',
            },
            {
                displayName: 'Recipient Username',
                name: 'recipient',
                type: 'string',
                default: '',
                required: true,
                description: 'Recipient Instagram username',
            },
            {
                displayName: 'Message',
                name: 'message',
                type: 'string',
                default: '',
                required: true,
                description: 'Message to send',
            },
        ],
    };

    async execute(this) {
        const username = this.getNodeParameter('username', 0);
        const password = this.getNodeParameter('password', 0);
        const recipient = this.getNodeParameter('recipient', 0);
        const message = this.getNodeParameter('message', 0);

        const client = new Client();

        try {
            await client.login(username, password);
            const userId = await client.user_id_from_username(recipient);
            await client.direct_send(message, [userId]);

            return this.helpers.returnJsonArray([{ success: true, recipient }]);
        } catch (error) {
            throw new Error(`Failed to send DM: ${error.message}`);
        }
    }
}

module.exports = { InstagramDM };

