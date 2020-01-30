SELECT System.Timestamp as [Time Ending],
    COUNT(*) AS [Times Triggered]
FROM CameraInput TIMESTAMP BY timestamp
GROUP BY TumblingWindow(n, 1)