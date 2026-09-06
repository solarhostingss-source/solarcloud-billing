const crypto = require('crypto');

async function createUser(email) {
  const username = email.split('@')[0] + '_' + Date.now().toString(36);
  const password = crypto.randomBytes(16).toString('hex');
  const url = `${process.env.PTERODACTYL_URL}/api/application/users`;
  const headers = {
    'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
    'Accept': 'application/vnd.pterodactyl.v1+json',
    'Content-Type': 'application/json'
  };
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, username, first_name: 'Solar', last_name: 'Client', password })
  });
  
  if (res.status === 422) {
    const searchRes = await fetch(`${url}?filter[email]=${email}`, { headers });
    const searchData = await searchRes.json();
    return searchData.data[0].attributes.id;
  }
  
  const data = await res.json();
  return data.attributes.id;
}

async function createServer(userId, planConfig, nodeId, nestId, eggId) {
  const url = `${process.env.PTERODACTYL_URL}/api/application/servers`;
  const headers = {
    'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
    'Accept': 'application/vnd.pterodactyl.v1+json',
    'Content-Type': 'application/json'
  };
  
  const isMc = planConfig.type === 'minecraft';
  const name = `${planConfig.name}-${crypto.randomBytes(4).toString('hex')}`;
  
  const body = {
    name,
    user: parseInt(userId),
    nest: parseInt(nestId),
    egg: parseInt(eggId),
    docker_image: isMc ? 'ghcr.io/pterodactyl/yolks:java_21' : 'ghcr.io/pterodactyl/yolks:nodejs_18',
    startup: isMc ? 'java -Xms128M -XX:MaxRAMPercentage=95.0 -Dterminal.jline=false -Dterminal.ansi=true -jar server.jar' : 'node index.js',
    limits: {
      memory: planConfig.memory,
      swap: 0,
      disk: planConfig.disk,
      io: 500,
      cpu: planConfig.cpu
    },
    feature_limits: {
      databases: 1,
      allocations: 1,
      backups: 2
    },
    deploy: {
      locations: [parseInt(nodeId)],
      dedicated_ip: false,
      port_range: []
    },
    environment: isMc ? { MINECRAFT_VERSION: 'latest', SERVER_JARFILE: 'server.jar', BUILD_NUMBER: 'latest' } : {}
  };
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  
  return res.json();
}

module.exports = {
  createUser,
  createServer
};
