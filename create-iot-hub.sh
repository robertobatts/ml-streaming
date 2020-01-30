export HUB_NAME="hubmlstreaming"

az iot hub create \
    --name $HUB_NAME \
    --resource-group learn-721c9263-313f-4909-8b29-8548b49f792c \
    --location southcentralus \
    --sku S1 --partition-count 2


mkdir photoproc
cd photoproc

npm init -y
npm install azure-iothub --save
npm install azure-iot-device azure-iot-device-mqtt --save