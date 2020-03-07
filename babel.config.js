module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-es2015'
  ],
  plugins: ['@babel/plugin-transform-modules-umd']
};
