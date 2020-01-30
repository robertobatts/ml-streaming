export SERVER_NAME="mlstreamingdb"

az sql server create --name $SERVER_NAME \
    --resource-group learn-721c9263-313f-4909-8b29-8548b49f792c \
    --location southcentralus \
    --admin-user username --admin-password password