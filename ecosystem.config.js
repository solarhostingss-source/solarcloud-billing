module.exports = {
  apps: [{
    name: 'solarcloud-billing',
    script: 'src/server.js',
    instances: 1,
    env: { NODE_ENV: 'production' }
  }]
};
