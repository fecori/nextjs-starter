module.exports = {
  webpack: function (config, { isServer }) {
    config.resolve.extensions.push('.jsx');
    return config
  }
}
