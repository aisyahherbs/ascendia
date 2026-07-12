module.exports = {
  apps: [
    {
      name: "ascendia-backend",
      script: "src/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 8080
      },
      max_memory_restart: "700M",
      time: true
    }
  ]
};
