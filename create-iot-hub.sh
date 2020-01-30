export HUB_NAME="hubmlstreaming"

az iot hub create \
    --name $HUB_NAME \
    --resource-group learn-721c9263-313f-4909-8b29-8548b49f792c \
    --location southcentralus \
    --sku S1 --partition-count 2