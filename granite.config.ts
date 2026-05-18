import { router } from '@granite-js/plugin-router';
import { hermes } from '@granite-js/plugin-hermes';
import { appsInToss } from '@apps-in-toss/plugins';
import { defineConfig } from '@granite-js/react-native/config';

export default defineConfig({
  appName: 'dont-tap',
  scheme: 'intoss',
  plugins: [router(), hermes(), appsInToss({
      brand: {
        displayName: '버튼 참기 챌린지', // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
        primaryColor: '#3182F6', // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
        icon: 'https://static.toss.im/appsintoss/33837/962cd134-bbc1-4380-9597-c1fd28263e05.png', // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
      },
      permissions: [],
    }),],
});
