class MockDevice {
  start(onData) {
    setInterval(() => {
      const data = {
        bp: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 10)}`,
        spo2: 95 + Math.floor(Math.random() * 5),
        hr: 65 + Math.floor(Math.random() * 20),
        temp: (36 + Math.random() * 2).toFixed(1),
        ecg: Math.sin(Date.now() / 80) + (Math.random() * 0.1)
      };

      onData(data);
    }, 500);
  }
}

module.exports = MockDevice;