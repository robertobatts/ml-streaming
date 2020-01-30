export ACCOUNT_NAME="accountmlstreaming"

az storage account create \
    --name $ACCOUNT_NAME \
    --resource-group learn-721c9263-313f-4909-8b29-8548b49f792c \
    --location southcentralus \
    --kind StorageV2 \
    --sku Standard_LRS

az storage container create \
    --name photos \
    --account-name $ACCOUNT_NAME \
    --public-access blob