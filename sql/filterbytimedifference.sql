SELECT C1.deviceId, C1.latitude, C1.longitude, C1.url, C1.timestamp
  INTO FunctionOutput
  FROM CameraInput C1 TIMESTAMP BY timestamp
  JOIN CameraInput C2 TIMESTAMP BY timestamp
    ON C1.deviceId = C2.deviceId
        AND DATEDIFF(ss, C1, C2) BETWEEN 0 AND 10
        AND C1.timestamp != C2.timestamp
    