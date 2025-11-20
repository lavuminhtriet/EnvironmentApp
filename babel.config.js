module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Quan trọng: Dòng này bắt buộc phải có để chạy UI mượt mà
      'react-native-reanimated/plugin',
    ],
  };
};