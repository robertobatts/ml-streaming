az extension add --name azure-cli-iot-ext

az iot hub device-identity list -n $HUB_NAME | grep deviceId