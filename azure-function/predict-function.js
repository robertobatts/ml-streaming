module.exports = function (context, req) {
  var predictionUrl = 'PREDICTION_URL';
  var predictionKey = 'PREDICTION_KEY';
  var storageAccountName = 'ACCOUNT_NAME';
  var storageAccountKey = 'ACCOUNT_KEY';
  var databaseServer = 'SERVER_NAME.database.windows.net';
  var databaseUsername = 'ADMIN_USERNAME';
  var databasePassword = 'ADMIN_PASSWORD';
  var databaseName = 'photodb';

  // Parse input
  var input = JSON.parse(req.rawBody)[0];
  var id = input.deviceid;
  var latitude = input.latitude;
  var longitude = input.longitude;
  var url = input.url;
  var blobName = url.substr(url.lastIndexOf('/') + 1);
  var timestamp = input.timestamp;

  // Generate a SAS
  var azure = require('azure-storage');
  var blobService = azure.createBlobService(storageAccountName, storageAccountKey);

  var now = new Date();
  var expiry = new Date(now).setMinutes(now.getMinutes() + 3);

  var policy = {
      AccessPolicy: {
          Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
          Start: now,
          Expiry: expiry
      },
  };

  var sas = blobService.generateSharedAccessSignature('photos', blobName, policy);

  // Call the Custom Vision Service
  const options = {
      url: predictionUrl,
      method: 'POST',
      headers: {
          'Prediction-Key': predictionKey
      },
      body: {
          'Url': url + '?' + sas
      },
      json: true
  };

  var request = require('request');

  request(options, (err, res, body) => {
      if (err) {
          context.log(err);
          context.done();
      }
      else {
          var probability =  body.predictions.find(p => p.tagName.toLowerCase() === 'polar bear').probability;
          var isPolarBear = probability > 0.8; // 80% threshhold

          // Update the database
          var Connection = require('tedious').Connection;
          var Request = require('tedious').Request;

          var config =
          {
              authentication:
              {
                  type: 'default',
                  options:
                  {
                      userName: databaseUsername,
                      password: databasePassword
                  }
              },
              server: databaseServer,
              options:
              {
                  database: databaseName,
                  encrypt: true
              }
          }

          var connection = new Connection(config);

          connection.on('connect', (err) => {
              if (err) {
                  context.log(err)
                  context.done();
              }
              else {
                  var query = "INSERT INTO dbo.PolarBears (CameraID, Latitude, Longitude, URL, Timestamp, IsPolarBear) " +
                      "VALUES ('" + id + "', " + latitude + ", " + longitude + ", '" + url + "', '" + timestamp + "', " + (isPolarBear ? "1" : "0") + ")";

                  dbRequest = new Request(query, err => {
                      if (err) {
                          context.log(err);
                          context.done();
                      }
                  });

                  dbRequest.on('error', err => {
                      context.log(err);
                      context.done();
                  });

                  dbRequest.on('requestCompleted', () => {
                      context.done();
                  });

                  connection.execSql(dbRequest);
              }
          });
      }
  });
};